package com.reconocimiento.facial.plugin

import android.Manifest
import android.app.Activity
import android.content.Intent
import androidx.activity.result.ActivityResult
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.reconocimiento.facial.ui.liveness.LivenessActivity
import com.reconocimiento.facial.ui.liveness.LivenessViewModel

// Puente entre Angular y Android. Desde TypeScript: Liveness.iniciar({ sessionId })
// abre LivenessActivity y se resuelve cuando la prueba termina (o se rechaza si hubo
// error o se canceló). La lógica de la pantalla está en LivenessViewModel.
@CapacitorPlugin(
    name = "Liveness",
    permissions = [Permission(alias = "camera", strings = [Manifest.permission.CAMERA])]
)
class LivenessPlugin : Plugin() {

    @PluginMethod
    fun iniciar(call: PluginCall) {
        if (call.getString("sessionId").isNullOrBlank()) {
            call.reject("Falta el sessionId")
            return
        }
        // El detector de Amplify no pide el permiso de cámara: hay que pedirlo antes de mostrarlo
        if (getPermissionState("camera") != PermissionState.GRANTED) {
            requestPermissionForAlias("camera", call, "permisoCamaraCallback")
            return
        }
        abrirDetector(call)
    }

    @PermissionCallback
    private fun permisoCamaraCallback(call: PluginCall) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            abrirDetector(call)
        } else {
            call.reject("Se necesita el permiso de cámara para la prueba de vida", "PERMISO_DENEGADO")
        }
    }

    private fun abrirDetector(call: PluginCall) {
        val intent = Intent(context, LivenessActivity::class.java).apply {
            putExtra(LivenessViewModel.EXTRA_SESSION_ID, call.getString("sessionId"))
            putExtra(LivenessViewModel.EXTRA_REGION, call.getString("region", LivenessViewModel.REGION_POR_DEFECTO))
        }
        startActivityForResult(call, intent, "detectorCallback")
    }

    @ActivityCallback
    private fun detectorCallback(call: PluginCall, result: ActivityResult) {
        when (result.resultCode) {
            Activity.RESULT_OK -> call.resolve(JSObject().put("sessionId", call.getString("sessionId")))
            LivenessActivity.RESULT_ERROR -> call.reject(
                result.data?.getStringExtra(LivenessActivity.EXTRA_ERROR) ?: "Error en la prueba de vida",
                "ERROR_DETECTOR"
            )
            else -> call.reject("Prueba de vida cancelada", "CANCELADO")
        }
    }
}
