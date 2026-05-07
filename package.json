package com.ac4stivenill.app;

import android.content.Intent;
import android.widget.RemoteViewsService;

public class CalendarWidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        android.util.Log.d("CalendarWidgetService", "onGetViewFactory called");
        return new CalendarWidgetFactory(this, intent);
    }
}
