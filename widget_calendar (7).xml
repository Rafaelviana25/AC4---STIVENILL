package com.meuapp.calendario

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

class WebAppInterface(private val mContext: Context) {
    @JavascriptInterface
    fun updateWidget(data: String) {
        // Salva os dados para o widget usar
        val prefs = mContext.getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("widget_data", data).apply()

        // Avisa o widget para se atualizar
        val intent = Intent(mContext, CalendarWidgetProvider::class.java)
        intent.action = "android.appwidget.action.APPWIDGET_UPDATE"
        mContext.sendBroadcast(intent)
    }
}
