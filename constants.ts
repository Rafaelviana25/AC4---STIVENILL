package com.ac4stivenill.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.ac4stivenill.app.R;

public class CalendarWidgetFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context;
    private List<DayInfo> days = new ArrayList<>();
    private static final String TAG = "CalendarWidgetFactory";

    private static class DayInfo {
        int day;
        boolean isCurrentMonth;
        boolean isToday;
        
        // Shift 1
        int color1 = Color.TRANSPARENT;
        int textColor1 = Color.WHITE;
        String label1 = "";
        
        // Shift 2
        int color2 = Color.TRANSPARENT;
        int textColor2 = Color.WHITE;
        String label2 = "";
        
        String holidayName = "";
        boolean hasObservation = false;

        DayInfo(int day, boolean isCurrentMonth, boolean isToday) {
            this.day = day;
            this.isCurrentMonth = isCurrentMonth;
            this.isToday = isToday;
        }
    }

    private static final Map<String, String> HOLIDAYS = new HashMap<>();
    static {
        HOLIDAYS.put("01-01", "Ano Novo");
        HOLIDAYS.put("04-03", "Sexta-feira Santa");
        HOLIDAYS.put("04-21", "Dia de Tiradentes");
        HOLIDAYS.put("05-01", "Dia do Trabalho");
        HOLIDAYS.put("09-07", "Independência do Brasil");
        HOLIDAYS.put("10-12", "Nossa Sra. Aparecida");
        HOLIDAYS.put("11-02", "Dia de Finados");
        HOLIDAYS.put("11-15", "Proclamação da República");
        HOLIDAYS.put("11-20", "Dia da Consciência Negra");
        HOLIDAYS.put("12-25", "Natal");
        HOLIDAYS.put("02-16", "Carnaval");
        HOLIDAYS.put("02-17", "Carnaval");
        HOLIDAYS.put("02-18", "Quarta-feira de Cinzas");
        HOLIDAYS.put("06-04", "Corpus Christi");
    }

    public CalendarWidgetFactory(Context context, Intent intent) {
        this.context = context;
    }

    @Override
    public void onCreate() {}

    @Override
    public void onDataSetChanged() {
        Log.d(TAG, "onDataSetChanged: START");
        try {
            days.clear();
            Calendar cal = Calendar.getInstance();
            int todayDay = cal.get(Calendar.DAY_OF_MONTH);
            int todayMonth = cal.get(Calendar.MONTH);
            int todayYear = cal.get(Calendar.YEAR);

            SharedPreferences prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE);
            
            int viewedMonth = prefs.getInt("viewed_month", todayMonth);
            int viewedYear = prefs.getInt("viewed_year", todayYear);

            String jsonData = prefs.getString("calendar_data", null);
            Log.d(TAG, "onDataSetChanged: ViewedMonth=" + viewedMonth + ", ViewedYear=" + viewedYear);
            
            Map<String, JSONObject> eventsMap = new HashMap<>();
            Map<String, JSONObject> shiftTypesMap = new HashMap<>();

            if (jsonData != null && !jsonData.isEmpty() && !jsonData.equals("{}")) {
                Log.d(TAG, "onDataSetChanged: Data found, length = " + jsonData.length());
                try {
                    JSONObject root = new JSONObject(jsonData);
                    JSONArray events = root.optJSONArray("events");
                    JSONArray shiftTypes = root.optJSONArray("shiftTypes");

                    if (shiftTypes != null) {
                        for (int i = 0; i < shiftTypes.length(); i++) {
                            JSONObject st = shiftTypes.getJSONObject(i);
                            shiftTypesMap.put(st.optString("id"), st);
                        }
                    }
                    if (events != null) {
                        for (int i = 0; i < events.length(); i++) {
                            JSONObject ev = events.getJSONObject(i);
                            eventsMap.put(ev.optString("date"), ev);
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error parsing JSON data", e);
                }
            } else {
                Log.w(TAG, "onDataSetChanged: No data found in SharedPreferences (calendar_data is null or empty)");
            }

            cal.set(Calendar.YEAR, viewedYear);
            cal.set(Calendar.MONTH, viewedMonth);
            cal.set(Calendar.DAY_OF_MONTH, 1);
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            
            int firstDayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
            int daysInMonth = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

            // Monday start logic (1=Sun, 2=Mon, ..., 7=Sat)
            // If Sun(1), startOffset = 6
            // If Mon(2), startOffset = 0
            // If Tue(3), startOffset = 1
            int startOffset = (firstDayOfWeek == Calendar.SUNDAY) ? 6 : firstDayOfWeek - 2;

            Calendar prevMonthCal = (Calendar) cal.clone();
            prevMonthCal.add(Calendar.MONTH, -1);
            int daysInPrevMonth = prevMonthCal.getActualMaximum(Calendar.DAY_OF_MONTH);
            for (int i = 0; i < startOffset; i++) {
                days.add(new DayInfo(daysInPrevMonth - startOffset + i + 1, false, false));
            }

            for (int i = 1; i <= daysInMonth; i++) {
                String dateStr = String.format("%04d-%02d-%02d", viewedYear, viewedMonth + 1, i);
                String mmdd = String.format("%02d-%02d", viewedMonth + 1, i);
                
                JSONObject event = eventsMap.get(dateStr);
                boolean isToday = (i == todayDay && viewedMonth == todayMonth && viewedYear == todayYear);
                
                DayInfo day = new DayInfo(i, true, isToday);
                day.holidayName = HOLIDAYS.get(mmdd);

                if (event != null) {
                    JSONArray shiftIds = event.optJSONArray("shiftTypeIds");
                    JSONObject overrides = event.optJSONObject("overrides");
                    String observation = event.optString("observation", "");
                    day.hasObservation = (observation != null && !observation.trim().isEmpty());
                    
                    if (shiftIds != null) {
                        for (int sIdx = 0; sIdx < Math.min(shiftIds.length(), 2); sIdx++) {
                            String sId = shiftIds.optString(sIdx);
                            JSONObject baseShift = shiftTypesMap.get(sId);
                            JSONObject override = (overrides != null) ? overrides.optJSONObject(sId) : null;
                            
                            int bgColor = Color.TRANSPARENT;
                            int textColor = Color.WHITE;
                            String label = "";
                            
                            if (baseShift != null) {
                                bgColor = parseSafeColor(baseShift.optString("color"), Color.TRANSPARENT);
                                textColor = parseSafeColor(baseShift.optString("textColor"), Color.WHITE);
                                label = baseShift.optString("label", "");
                            }
                            
                            if (override != null) {
                                if (override.has("color")) bgColor = parseSafeColor(override.optString("color"), bgColor);
                                if (override.has("textColor")) textColor = parseSafeColor(override.optString("textColor"), textColor);
                                if (override.has("label")) label = override.optString("label", label);
                            }
                            
                            if (sIdx == 0) {
                                day.color1 = bgColor;
                                day.textColor1 = textColor;
                                day.label1 = label;
                            } else {
                                day.color2 = bgColor;
                                day.textColor2 = textColor;
                                day.label2 = label;
                            }
                        }
                    }
                }
                days.add(day);
            }

            while (days.size() < 42) {
                days.add(new DayInfo(days.size() - (startOffset + daysInMonth) + 1, false, false));
            }
            Log.d(TAG, "onDataSetChanged: END, total days = " + days.size());
        } catch (Exception e) {
            Log.e(TAG, "Critical error in onDataSetChanged", e);
        } finally {
            // Guarantee at least 42 items to avoid "Loading" state
            if (days.size() < 42) {
                Log.w(TAG, "onDataSetChanged: days list too small (" + days.size() + "), padding to 42");
                while (days.size() < 42) {
                    days.add(new DayInfo(days.size() + 1, false, false));
                }
            }
        }
    }

    private int parseSafeColor(String colorStr, int fallback) {
        if (colorStr == null || !colorStr.startsWith("#")) return fallback;
        try {
            return Color.parseColor(colorStr);
        } catch (Exception e) {
            return fallback;
        }
    }

    @Override
    public void onDestroy() {
        days.clear();
    }

    @Override
    public int getCount() {
        return days.size();
    }

    @Override
    public RemoteViews getViewAt(int position) {
        Log.d(TAG, "getViewAt: position = " + position);
        try {
            if (position >= days.size()) {
                Log.w(TAG, "getViewAt: position out of bounds (" + position + " >= " + days.size() + ")");
                return new RemoteViews(context.getPackageName(), R.layout.widget_calendar_item);
            }

            DayInfo dayInfo = days.get(position);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_calendar_item);

            // Reset visibility and backgrounds
            views.setViewVisibility(R.id.shift_label, View.GONE);
            views.setViewVisibility(R.id.shift_2_bg, View.GONE);
            views.setViewVisibility(R.id.observation_dot, View.GONE);
            views.setViewVisibility(R.id.holiday_label, View.GONE);
            views.setInt(R.id.shift_1_bg, "setBackgroundColor", Color.TRANSPARENT);
            views.setInt(R.id.shift_2_bg, "setBackgroundColor", Color.TRANSPARENT);
            views.setInt(R.id.day_number_container, "setBackgroundResource", 0);
            views.setInt(R.id.day_number_container, "setBackgroundColor", Color.TRANSPARENT);

            boolean hasShifts = dayInfo.color1 != Color.TRANSPARENT || dayInfo.color2 != Color.TRANSPARENT;
            boolean isWeekend = (position % 7 == 5) || (position % 7 == 6);

            // 1. Day Container Background
            if (!dayInfo.isCurrentMonth) {
                views.setInt(R.id.day_container, "setBackgroundColor", Color.parseColor("#991E293B")); // bg-slate-800/60
            } else if (dayInfo.holidayName != null && !hasShifts) {
                views.setInt(R.id.day_container, "setBackgroundColor", Color.parseColor("#475569")); // bg-slate-600
            } else if (isWeekend && !hasShifts) {
                views.setInt(R.id.day_container, "setBackgroundColor", Color.parseColor("#CBD5E1")); // bg-slate-300
            } else {
                views.setInt(R.id.day_container, "setBackgroundColor", Color.parseColor("#FFFFFF")); // bg-white
            }

            // 2. Shifts
            if (dayInfo.color1 != Color.TRANSPARENT) {
                views.setInt(R.id.shift_1_bg, "setBackgroundColor", dayInfo.color1);
                if (dayInfo.label1 != null && !dayInfo.label1.isEmpty()) {
                    views.setTextViewText(R.id.shift_label, dayInfo.label1.toUpperCase());
                    views.setTextColor(R.id.shift_label, dayInfo.textColor1);
                    views.setViewVisibility(R.id.shift_label, View.VISIBLE);
                }
            }

            if (dayInfo.color2 != Color.TRANSPARENT) {
                views.setInt(R.id.shift_2_bg, "setBackgroundColor", dayInfo.color2);
                views.setViewVisibility(R.id.shift_2_bg, View.VISIBLE);
                if (dayInfo.label2 != null && !dayInfo.label2.isEmpty()) {
                    views.setTextViewText(R.id.shift_label_2, dayInfo.label2.toUpperCase());
                    views.setTextColor(R.id.shift_label_2, dayInfo.textColor2);
                }
            }

            // 3. Day Number
            views.setTextViewText(R.id.day_text, String.valueOf(dayInfo.day));
            
            if (hasShifts) {
                views.setInt(R.id.day_number_container, "setBackgroundResource", R.drawable.bg_circle_black_20);
                views.setTextColor(R.id.day_text, Color.WHITE);
            } else if (dayInfo.isToday) {
                views.setInt(R.id.day_number_container, "setBackgroundResource", R.drawable.bg_circle_lime_500);
                views.setTextColor(R.id.day_text, Color.parseColor("#0F172A")); // text-slate-900
            } else if (!dayInfo.isCurrentMonth) {
                views.setTextColor(R.id.day_text, Color.parseColor("#64748B")); // text-slate-500
            } else {
                views.setTextColor(R.id.day_text, Color.BLACK);
            }

            // 4. Observation Dot
            if (dayInfo.hasObservation) {
                views.setViewVisibility(R.id.observation_dot, View.VISIBLE);
                if (hasShifts) {
                    views.setInt(R.id.observation_dot, "setColorFilter", Color.parseColor("#CCFFFFFF")); // bg-white/80
                } else {
                    views.setInt(R.id.observation_dot, "setColorFilter", Color.parseColor("#60A5FA")); // bg-blue-400
                }
            }

            // 5. Holiday Label
            if (dayInfo.holidayName != null && !dayInfo.holidayName.isEmpty()) {
                views.setViewVisibility(R.id.holiday_label, View.VISIBLE);
                views.setTextViewText(R.id.holiday_label, dayInfo.holidayName.toUpperCase());
            }

            return views;
        } catch (Exception e) {
            Log.e(TAG, "Error in getViewAt position " + position, e);
            return new RemoteViews(context.getPackageName(), R.layout.widget_calendar_item);
        }
    }

    @Override
    public RemoteViews getLoadingView() {
        return null;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }
}
