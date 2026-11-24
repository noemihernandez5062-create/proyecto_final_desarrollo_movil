package com.reconocimiento.facial.ui.liveness

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import com.reconocimiento.facial.model.LivenessState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

// SavedStateHandle trae los extras del Intent (sessionId y region) y los conserva
// si Android recrea la pantalla (por ejemplo, al girar el celular).
class LivenessViewModel(savedStateHandle: SavedStateHandle) : ViewModel() {

    private val sessionId: String? = savedStateHandle[EXTRA_SESSION_ID]
    private val region: String = savedStateHandle[EXTRA_REGION] ?: REGION_POR_DEFECTO

    private val _state = MutableStateFlow<LivenessState>(
        if (sessionId.isNullOrBlank()) LivenessState.Error("Falta el sessionId")
        else LivenessState.Detectando(sessionId, region)
    )
    val state: StateFlow<LivenessState> = _state.asStateFlow()

    // onComplete del detector
    fun onPruebaTerminada() {
        sessionId?.let { _state.value = LivenessState.Terminado(it) }
    }

    // onError del detector (cámara, credenciales de Cognito, tiempo agotado...)
    fun onErrorDetector(mensaje: String?) {
        _state.value = LivenessState.Error(
            if (mensaje.isNullOrBlank()) "Error en la prueba de vida" else mensaje
        )
    }

    fun onCancelar() {
        _state.value = LivenessState.Cancelado
    }

    companion object {
        const val EXTRA_SESSION_ID = "sessionId"
        const val EXTRA_REGION = "region"

        // Región de Rekognition Face Liveness (la misma de las Lambdas)
        const val REGION_POR_DEFECTO = "us-east-1"
    }
}
