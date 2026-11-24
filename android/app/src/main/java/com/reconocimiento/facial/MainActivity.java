package com.reconocimiento.facial;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.reconocimiento.facial.plugin.LivenessPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Los plugins propios (locales) se registran antes de super.onCreate
        registerPlugin(LivenessPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
