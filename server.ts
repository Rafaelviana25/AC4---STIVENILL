<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/day_container"
    android:layout_width="match_parent"
    android:layout_height="55dp"
    android:background="#FFFFFF"
    android:padding="0dp">

    <!-- Container para os turnos -->
    <LinearLayout
        android:id="@+id/shifts_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

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
                android:text="TURNO"
                android:textColor="#FFFFFF"
                android:textSize="8sp"
                android:textStyle="bold"
                android:visibility="gone" />
        </RelativeLayout>

        <RelativeLayout
            android:id="@+id/shift_2_bg"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:visibility="gone">
            <TextView
                android:id="@+id/shift_label_2"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_centerInParent="true"
                android:gravity="center"
                android:text="EXTRA"
                android:textColor="#FFFFFF"
                android:textSize="8sp"
                android:textStyle="bold" />
        </RelativeLayout>
    </LinearLayout>

    <!-- Ponto de Observação -->
    <ImageView
        android:id="@+id/observation_dot"
        android:layout_width="4dp"
        android:layout_height="4dp"
        android:layout_centerInParent="true"
        android:src="#60A5FA"
        android:visibility="gone" />

    <!-- Número do dia -->
    <RelativeLayout
        android:id="@+id/day_number_container"
        android:layout_width="16dp"
        android:layout_height="16dp"
        android:layout_alignParentStart="true"
        android:layout_alignParentTop="true"
        android:layout_margin="2dp">
        
        <TextView
            android:id="@+id/day_text"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:gravity="center"
            android:text="1"
            android:textColor="#000000"
            android:textSize="8sp"
            android:textStyle="bold" />
    </RelativeLayout>

    <!-- Label de Feriado -->
    <TextView
        android:id="@+id/holiday_label"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:background="#E6EF4444"
        android:gravity="center"
        android:paddingTop="1dp"
        android:paddingBottom="1dp"
        android:text="FERIADO"
        android:textColor="#FFFFFF"
        android:textSize="6sp"
        android:textStyle="bold"
        android:maxLines="1"
        android:ellipsize="end"
        android:visibility="gone" />
</RelativeLayout>
