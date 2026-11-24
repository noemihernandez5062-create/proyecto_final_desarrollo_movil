package com.reconocimiento.facial.ui.liveness

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.reconocimiento.facial.model.LivenessState
import kotlinx.coroutines.launch

// Aloja LivenessScreen. La abre LivenessPlugin y, cuando el ViewModel llega a un
// estado final, devuelve el resultado al plugin y se cierra.
class LivenessActivity : ComponentActivity() {

    private val livenessViewModel: LivenessViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent { LivenessScreen(livenessViewModel) }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                livenessViewModel.state.collect { state ->
                    when (state) {
                        is LivenessState.Detectando -> Unit
                        is LivenessState.Terminado -> terminar(RESULT_OK, null)
                        is LivenessState.Cancelado -> terminar(RESULT_CANCELED, null)
                        is LivenessState.Error -> terminar(RESULT_ERROR, state.mensaje)
                    }
                }
            }
        }
    }

    private fun terminar(resultado: Int, error: String?) {
        setResult(resultado, Intent().putExtra(EXTRA_ERROR, error))
        finish()
    }

    companion object {
        const val EXTRA_ERROR = "error"
        const val RESULT_ERROR = RESULT_FIRST_USER
    }
}
