# Reconocimiento facial – App móvil híbrida

Proyecto final del curso de Desarrollo Móvil (Universidad Da Vinci de Guatemala).
Autora: Anayeli Noemí Hernández Velásquez – Carné 202403508.

Aplicación **Ionic + Capacitor + Angular** que verifica la identidad de una persona con
**Amazon Rekognition Face Liveness** (prueba de vida) y **CompareFaces** (comparación de rostros).

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `src/` | App Ionic/Angular: pantalla de verificación (`app/home`), servicio que llama a las Lambdas (`app/services/rostros.service.ts`) y definición del plugin (`app/plugins/liveness.ts`) |
| `android/` | Proyecto nativo Android generado por Capacitor, con el plugin propio de Face Liveness |
| `aws/lambdas/` | **Backend**: código de las 3 funciones AWS Lambda (Node.js) |
| `aws/pruebas-lambdas.md` | URLs de las Lambdas y peticiones de prueba |

### Plugin de Capacitor (Android, MVVM)

El detector de prueba de vida de AWS Amplify no existe para Angular, así que se hizo un plugin
propio que abre el detector nativo de Android (`android/app/src/main/java/com/reconocimiento/facial/`):

```
model/LivenessState.kt              Model: estados de la prueba de vida
ui/liveness/LivenessViewModel.kt    ViewModel: eventos del detector (StateFlow)
ui/liveness/LivenessScreen.kt       View: Composable con FaceLivenessDetector
ui/liveness/LivenessActivity.kt     View: aloja la pantalla y devuelve el resultado
plugin/LivenessPlugin.kt            Puente entre Angular y Android
FacialApp.kt                        Inicializa Amplify (Identity Pool de Cognito)
```

## Backend (AWS, región us-east-1)

| Lambda | Operación de Rekognition | URL |
|---|---|---|
| livenessGetSessionId | CreateFaceLivenessSession | https://vlv66l7ka2c5udim2lek656oga0fytfc.lambda-url.us-east-1.on.aws/ |
| livenessGetSessionResults | GetFaceLivenessSessionResults | https://7x5b7rvyu72urovykdvblcrzhm0joiqw.lambda-url.us-east-1.on.aws/ |
| livenessCompareFaces | CompareFaces | https://gqmaekjtwnaxb3w7jptk47eq7i0kzesv.lambda-url.us-east-1.on.aws/ |

El celular obtiene credenciales temporales de un Identity Pool de Cognito (acceso de invitados)
para enviar el video de la prueba de vida a Rekognition.

## Flujo

1. La persona toma una **foto de referencia** con la cámara.
2. La app llama a `livenessGetSessionId` y recibe un `sessionId`.
3. El plugin abre el **detector de prueba de vida** con ese `sessionId`.
4. La app llama a `livenessGetSessionResults`: estado, confianza e imagen del rostro capturado.
5. La app llama a `livenessCompareFaces` con esa imagen y la foto de referencia.
6. Se muestra **Identidad verificada** o **El rostro no coincide**.

## Cómo ejecutar

```bash
npm install
ionic build
npx cap sync android
npx cap open android   # luego Run ▶ en Android Studio (Gradle JDK 21)
```
