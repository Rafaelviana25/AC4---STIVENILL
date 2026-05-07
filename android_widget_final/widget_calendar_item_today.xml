<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/day_container"
    android:layout_width="match_parent"
    android:layout_height="60dp"
    android:background="#FFFFFF"
    android:padding="0dp">

    <!-- Layout para 1 ou 2 turnos -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
        
        <!-- Turno Principal -->
        <RelativeLayout
            android:id="@+id/shift_1_bg"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1">
            <TextView
                android:id="@+id/shift_label"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_centerInParent="true"
                android:gravity="center"
                android:text=""
                android:textColor="#FFFFFF"
                android:textSize="7sp"
                android:textStyle="bold"
                android:visibility="gone" />
        </RelativeLayout>

        <!-- Turno Extra -->
        <RelativeLayout
            android:id="@+id/shift_2_bg"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:visibility="gone">
            <TextView
                android:id="@+id/shift_label_extra"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_centerInParent="true"
                android:gravity="center"
                android:text=""
                android:textColor="#FFFFFF"
                android:textSize="7sp"
                android:textStyle="bold" />
        </RelativeLayout>
    </LinearLayout>

    <!-- Ponto de Observação -->
    <ImageView
        android:id="@+id/observation_dot"
        android:layout_width="4dp"
        android:layout_height="4dp"
        android:layout_centerInParent="true"
        android:background="@android:color/white"
        android:visibility="gone" />

    <!-- Número do Dia (Destaque para Hoje) -->
    <RelativeLayout
        android:id="@+id/day_number_container"
        android:layout_width="16dp"
        android:layout_height="16dp"
        android:layout_alignParentEnd="true"
        android:layout_alignParentTop="true"
        android:layout_margin="2dp"
        android:background="#84CC16">
        
        <TextView
            android:id="@+id/day_text"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:gravity="center"
            android:text="1"
            android:textColor="#FFFFFF"
            android:textSize="8sp"
            android:textStyle="bold" />
    </RelativeLayout>

    <!-- Etiqueta de Feriado -->
    <TextView
        android:id="@+id/holiday_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="1dp"
        android:background="#CCEF4444"
        android:gravity="center"
        android:paddingLeft="2dp"
        android:paddingRight="2dp"
        android:text="FERIADO"
        android:textColor="#FFFFFF"
        android:textSize="5sp"
        android:textStyle="bold"
        android:visibility="gone" />
</RelativeLayout>
