package com.reconocimiento.facial.model

// Pasos de la prueba de vida dentro de la pantalla nativa
sealed interface LivenessState {

    // Detector de Amplify en pantalla: la persona hace la prueba de vida
    data class Detectando(val sessionId: String, val region: String) : LivenessState

    // El video ya se envió a Rekognition; el resultado lo consulta la app con la Lambda 2
    data class Terminado(val sessionId: String) : LivenessState

    // La persona cerró el detector
    data object Cancelado : LivenessState

    data class Error(val mensaje: String) : LivenessState
}
