package com.ac4stivenill.app;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import com.ac4stivenill.app.R;

public class WidgetBridge {
    private Context context;

    public WidgetBridge(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void updateCalendarData(String json) {
        if (json == null) return;
        
        SharedPreferences prefs = context.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE);
        prefs.edit().putString("calendar_data", json).apply();
        
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] ids = appWidgetManager.getAppWidgetIds(new ComponentName(context, CalendarWidget.class));
        
        appWidgetManager.notifyAppWidgetViewDataChanged(ids, R.id.calendar_grid);
        
        Intent intent = new Intent(context, CalendarWidget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }
}
