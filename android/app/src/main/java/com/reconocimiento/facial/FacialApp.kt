package com.reconocimiento.facial

import android.app.Application
import android.util.Log
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify

// Inicializa Amplify una sola vez al abrir la app.
// Lee res/raw/amplifyconfiguration.json (Identity Pool de Cognito para Face Liveness).
class FacialApp : Application() {

    override fun onCreate() {
        super.onCreate()

        try {
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(applicationContext)
            Log.i("FacialApp", "Amplify configurado")
        } catch (e: Exception) {
            // Sin Amplify la app abre igual; solo falla la prueba de vida
            Log.e("FacialApp", "No se pudo configurar Amplify", e)
        }
    }
}
