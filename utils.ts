package com.stivenill.ac4

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.content.Context.MODE_PRIVATE

class CalendarWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            // Lê os dados salvos pelo app (SharedPreferences)
            val prefs = context.getSharedPreferences("CapacitorStorage", MODE_PRIVATE)
            val extrasData = prefs.getString("extras_data", "Sem extras hoje")
            
            views.setTextViewText(R.id.widget_text, extrasData)
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
