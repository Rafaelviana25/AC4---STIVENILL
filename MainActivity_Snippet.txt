package com.ac4stivenill.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;
import android.graphics.Color;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import java.util.Calendar;
import com.ac4stivenill.app.R;

public class CalendarWidget extends AppWidgetProvider {

    public static final String ACTION_PREV_MONTH = "com.ac4stivenill.app.ACTION_PREV_MONTH";
    public static final String ACTION_NEXT_MONTH = "com.ac4stivenill.app.ACTION_NEXT_MONTH";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        
        String action = intent.getAction();
        if (ACTION_PREV_MONTH.equals(action) || ACTION_NEXT_MONTH.equals(action)) {
            SharedPreferences prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE);
            Calendar cal = Calendar.getInstance();
            
            int viewedMonth = prefs.getInt("viewed_month", cal.get(Calendar.MONTH));
            int viewedYear = prefs.getInt("viewed_year", cal.get(Calendar.YEAR));
            
            cal.set(Calendar.YEAR, viewedYear);
            cal.set(Calendar.MONTH, viewedMonth);
            cal.set(Calendar.DAY_OF_MONTH, 1);
            
            if (ACTION_PREV_MONTH.equals(action)) {
                cal.add(Calendar.MONTH, -1);
            } else {
                cal.add(Calendar.MONTH, 1);
            }
            
            prefs.edit()
                .putInt("viewed_month", cal.get(Calendar.MONTH))
                .putInt("viewed_year", cal.get(Calendar.YEAR))
                .apply();
            
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName thisWidget = new ComponentName(context, CalendarWidget.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.calendar_grid);
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        } else if (AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName thisWidget = new ComponentName(context, CalendarWidget.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.calendar_grid);
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_calendar);
        
        SharedPreferences prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE);
        Calendar cal = Calendar.getInstance();
        
        int viewedMonth = prefs.getInt("viewed_month", cal.get(Calendar.MONTH));
        int viewedYear = prefs.getInt("viewed_year", cal.get(Calendar.YEAR));
        
        cal.set(Calendar.YEAR, viewedYear);
        cal.set(Calendar.MONTH, viewedMonth);
        
        String[] monthNames = {"JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"};
        String month = monthNames[viewedMonth];
        String year = String.valueOf(viewedYear);
        String fullTitle = month + " " + year;
        
        SpannableString spannableTitle = new SpannableString(fullTitle);
        spannableTitle.setSpan(new ForegroundColorSpan(Color.parseColor("#64748B")), month.length() + 1, fullTitle.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        
        views.setTextViewText(R.id.widget_month_year, spannableTitle);

        Intent serviceIntent = new Intent(context, CalendarWidgetService.class);
        serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        // Force refresh by adding a unique timestamp to the URI
        serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME) + "/" + System.currentTimeMillis()));
        views.setRemoteAdapter(R.id.calendar_grid, serviceIntent);

        Intent prevIntent = new Intent(context, CalendarWidget.class);
        prevIntent.setAction(ACTION_PREV_MONTH);
        PendingIntent prevPendingIntent = PendingIntent.getBroadcast(context, 0, prevIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.btn_prev, prevPendingIntent);

        Intent nextIntent = new Intent(context, CalendarWidget.class);
        nextIntent.setAction(ACTION_NEXT_MONTH);
        PendingIntent nextPendingIntent = PendingIntent.getBroadcast(context, 1, nextIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.btn_next, nextPendingIntent);

        Intent appIntent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 2, appIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_month_year, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
