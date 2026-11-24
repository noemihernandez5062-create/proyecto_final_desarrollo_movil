package com.reconocimiento.facial.ui.liveness

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.amplifyframework.ui.liveness.ui.FaceLivenessDetector
import com.amplifyframework.ui.liveness.ui.LivenessColorScheme
import com.reconocimiento.facial.model.LivenessState

@Composable
fun LivenessScreen(livenessViewModel: LivenessViewModel) {

    val state by livenessViewModel.state.collectAsState()

    BackHandler { livenessViewModel.onCancelar() }

    when (val actual = state) {
        // El detector graba el rostro y envía el video directo a Rekognition
        // con las credenciales temporales de Cognito.
        is LivenessState.Detectando ->
            MaterialTheme(colorScheme = LivenessColorScheme.default()) {
                FaceLivenessDetector(
                    sessionId = actual.sessionId,
                    region = actual.region,
                    onComplete = { livenessViewModel.onPruebaTerminada() },
                    onError = { error -> livenessViewModel.onErrorDetector(error.message) }
                )
            }

        // Terminado / Cancelado / Error: la Activity cierra la pantalla en seguida
        else ->
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
    }
}
