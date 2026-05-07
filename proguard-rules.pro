package com.meuapp.calendario

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)

        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        
        // Adiciona a interface para comunicação com o Widget
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidWidget")

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // URL do seu aplicativo web
        webView.loadUrl("https://ais-dev-lxmjumbtt5gjpvtyqel34d-16976772385.us-west1.run.app")
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
