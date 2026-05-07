package com.meuapp.calendario

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        // Isso evita que o app fique por baixo da barra de notificações e navegação
        webView.fitsSystemWindows = true 
        setContentView(webView)

        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidWidget")

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // URL pública (Shared App URL) que NÃO pede login do Google
        webView.loadUrl("https://ais-pre-lxmjumbtt5gjpvtyqel34d-16976772385.us-west1.run.app")

        // Lida com o botão de voltar do celular
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}
