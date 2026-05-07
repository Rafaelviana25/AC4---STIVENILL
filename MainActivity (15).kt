package com.meuapp.calendario

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class CalendarWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == "android.appwidget.action.APPWIDGET_UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, CalendarWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    companion object {
        internal fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
            val widgetData = prefs.getString("widget_data", "{}")

            val views = RemoteViews(context.packageName, R.layout.widget_calendar)

            // Ao clicar no widget, abre o app
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            try {
                val json = JSONObject(widgetData!!)
                val eventsArray = json.optJSONArray("events")
                val shiftTypesArray = json.optJSONArray("shiftTypes")

                val shiftTypes = mutableMapOf<String, JSONObject>()
                if (shiftTypesArray != null) {
                    for (i in 0 until shiftTypesArray.length()) {
                        val shift = shiftTypesArray.getJSONObject(i)
                        shiftTypes[shift.getString("id")] = shift
                    }
                }

                val events = mutableMapOf<String, JSONObject>()
                if (eventsArray != null) {
                    for (i in 0 until eventsArray.length()) {
                        val event = eventsArray.getJSONObject(i)
                        events[event.getString("date")] = event
                    }
                }

                val calendar = Calendar.getInstance()
                val currentMonth = calendar.get(Calendar.MONTH)
                val currentYear = calendar.get(Calendar.YEAR)

                val monthNames = arrayOf("JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO")
                views.setTextViewText(R.id.widget_month_year, "${monthNames[currentMonth]} $currentYear")

                // Calcular os dias para preencher a grade
                val firstDayOfMonth = Calendar.getInstance()
                firstDayOfMonth.set(currentYear, currentMonth, 1)
                val firstDayOfWeek = firstDayOfMonth.get(Calendar.DAY_OF_WEEK)
                val adjustedFirstDay = if (firstDayOfWeek == Calendar.SUNDAY) 6 else firstDayOfWeek - 2

                val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

                for (i in 0 until 42) {
                    val cellId = context.resources.getIdentifier("cell_$i", "id", context.packageName)
                    if (cellId == 0) continue

                    val cellDate = Calendar.getInstance()
                    cellDate.set(currentYear, currentMonth, 1)
                    cellDate.add(Calendar.DAY_OF_MONTH, i - adjustedFirstDay)
                    
                    val dayNum = cellDate.get(Calendar.DAY_OF_MONTH)
                    val isCurrentMonth = cellDate.get(Calendar.MONTH) == currentMonth
                    val dateStr = dateFormat.format(cellDate.time)

                    views.setTextViewText(cellId, dayNum.toString())

                    var bgColor = if (isCurrentMonth) "#334155" else "#0F172A"
                    var textColor = if (isCurrentMonth) "#FFFFFF" else "#475569"

                    val event = events[dateStr]
                    if (event != null) {
                        val shiftIds = event.optJSONArray("shiftTypeIds")
                        if (shiftIds != null && shiftIds.length() > 0) {
                            val shiftId = shiftIds.getString(0)
                            val shift = shiftTypes[shiftId]
                            if (shift != null) {
                                bgColor = shift.optString("color", bgColor)
                                textColor = shift.optString("textColor", textColor)
                            }
                            
                            val overrides = event.optJSONObject("overrides")
                            if (overrides != null) {
                                val override = overrides.optJSONObject(shiftId)
                                if (override != null) {
                                    bgColor = override.optString("color", bgColor)
                                    textColor = override.optString("textColor", textColor)
                                }
                            }
                        }
                    }

                    try {
                        views.setInt(cellId, "setBackgroundColor", Color.parseColor(bgColor))
                        views.setTextColor(cellId, Color.parseColor(textColor))
                    } catch (e: Exception) {
                        views.setInt(cellId, "setBackgroundColor", Color.parseColor("#334155"))
                        views.setTextColor(cellId, Color.WHITE)
                    }
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
