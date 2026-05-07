<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ac4stivenill.app">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="AC4 STIVENILL"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:usesCleartextTraffic="true"
        android:networkSecurityConfig="@xml/network_security_config">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|navigation|density"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- CONFIGURAÇÃO DO WIDGET (RECEIVER) -->
        <receiver
            android:name=".CalendarWidget"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
                <!-- Actions para navegação de meses -->
                <action android:name="com.ac4stivenill.app.ACTION_PREV_MONTH" />
                <action android:name="com.ac4stivenill.app.ACTION_NEXT_MONTH" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/calendar_widget_info" />
        </receiver>

        <!-- SERVIÇO DO WIDGET (ESSENCIAL PARA O GRID FUNCIONAR) -->
        <service
            android:name=".CalendarWidgetService"
            android:permission="android.permission.BIND_REMOTEVIEWS"
            android:exported="false" />

    </application>
</manifest>
