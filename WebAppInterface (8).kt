<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0F172A"
    android:padding="8dp">

    <!-- Cabeçalho Mês/Ano -->
    <TextView
        android:id="@+id/widget_month_year"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="MÊS ANO"
        android:textColor="#FFFFFF"
        android:textSize="14sp"
        android:textStyle="bold"
        android:gravity="center"
        android:paddingBottom="8dp"/>

    <!-- Dias da Semana -->
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:weightSum="7">
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="S" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="T" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="Q" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="Q" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="S" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="S" android:textColor="#94A3B8" android:textSize="10sp"/>
        <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:gravity="center" android:text="D" android:textColor="#94A3B8" android:textSize="10sp"/>
    </LinearLayout>

    <!-- Grade do Calendário (6 semanas = 42 dias) -->
    <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="vertical" android:weightSum="6">
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_0" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_1" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_2" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_3" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_4" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_5" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_6" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_7" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_8" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_9" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_10" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_11" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_12" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_13" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_14" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_15" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_16" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_17" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_18" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_19" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_20" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_21" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_22" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_23" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_24" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_25" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_26" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_27" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_28" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_29" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_30" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_31" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_32" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_33" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_34" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
        <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal" android:weightSum="7">
            <TextView android:id="@+id/cell_35" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_36" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_37" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_38" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_39" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_40" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
            <TextView android:id="@+id/cell_41" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1" android:gravity="center" android:textSize="10sp" android:textStyle="bold" android:layout_margin="1dp" android:background="#1E293B" android:textColor="#FFFFFF"/>
        </LinearLayout>
    </LinearLayout>
</LinearLayout>
