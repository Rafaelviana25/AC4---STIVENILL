<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0F172A"
    android:orientation="vertical"
    android:padding="0dp">

    <!-- Header -->
    <RelativeLayout
        android:id="@+id/header_container"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:background="#0F172A"
        android:paddingLeft="12dp"
        android:paddingRight="12dp">

        <TextView
            android:id="@+id/btn_prev"
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:layout_alignParentStart="true"
            android:layout_centerVertical="true"
            android:background="#1E293B"
            android:gravity="center"
            android:text="‹"
            android:textColor="#94A3B8"
            android:textSize="20sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/widget_month_year"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:layout_centerInParent="true"
            android:gravity="center"
            android:text="ABRIL 2026"
            android:textColor="#E2E8F0"
            android:textSize="14sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/btn_next"
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:layout_alignParentEnd="true"
            android:layout_centerVertical="true"
            android:background="#1E293B"
            android:gravity="center"
            android:text="›"
            android:textColor="#94A3B8"
            android:textSize="20sp"
            android:textStyle="bold" />
    </RelativeLayout>

    <!-- Weekday Headers -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="#0F172A"
        android:orientation="horizontal"
        android:paddingBottom="6dp"
        android:paddingTop="6dp">
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="SEG" android:textColor="#64748B" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="TER" android:textColor="#64748B" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="QUA" android:textColor="#64748B" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="QUI" android:textColor="#64748B" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="SEX" android:textColor="#64748B" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="SÁB" android:textColor="#A3E635" android:textSize="8sp" android:textStyle="bold" />
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="DOM" android:textColor="#A3E635" android:textSize="8sp" android:textStyle="bold" />
    </LinearLayout>

    <!-- Grid -->
    <GridView
        android:id="@+id/calendar_grid"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#334155"
        android:horizontalSpacing="1dp"
        android:numColumns="7"
        android:stretchMode="columnWidth"
        android:verticalSpacing="1dp" />
</LinearLayout>
