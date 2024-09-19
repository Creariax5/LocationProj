package com.locationproj

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {
    private var isOnNewIntent = false

    override fun getMainComponentName(): String = "LocationProj"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        isOnNewIntent = true
        foregroundEmitter()
    }

    override fun onStart() {
        super.onStart()
        if (!isOnNewIntent) {
            foregroundEmitter()
        }
    }

    private fun foregroundEmitter() {
        val main = intent.getStringExtra("mainOnPress")
        val btn = intent.getStringExtra("buttonOnPress")
        val map = Arguments.createMap().apply {
            main?.let { putString("main", it) }
            btn?.let { putString("button", it) }
        }
        try {
            reactInstanceManager.currentReactContext
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("notificationClickHandle", map)
        } catch (e: Exception) {
            Log.e("SuperLog", "Caught Exception: ${e.message}")
        }
    }
}