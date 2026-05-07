package com.meuapp.calendario

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

class WebAppInterface(private val mContext: Context) {
    @JavascriptInterface
    fun updateCalendarData(data: String) {
        val prefs = mContext.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("widget_data", data).apply()

        val intent = Intent(mContext, CalendarWidgetProvider::class.java)
        intent.action = "android.appwidget.action.APPWIDGET_UPDATE"
        mContext.sendBroadcast(intent)
    }
}
