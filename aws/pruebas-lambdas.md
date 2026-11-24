# Pruebas de las Lambdas (Function URL)

Región: `us-east-1`. Las 3 URLs aceptan `POST` con cuerpo JSON y tienen CORS habilitado.
Se pueden probar con Postman (método POST, Body → raw → JSON) o con `curl` desde una terminal.

## 1. livenessGetSessionId — crear sesión de prueba de vida

URL: https://vlv66l7ka2c5udim2lek656oga0fytfc.lambda-url.us-east-1.on.aws/

```bash
curl -X POST https://vlv66l7ka2c5udim2lek656oga0fytfc.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" -d '{}'
```

Respuesta (200): el `sessionId` de Rekognition

```json
"6a6e6a72-0349-41da-af4a-47cc97e7fd21"
```

## 2. livenessGetSessionResults — resultado de la prueba de vida

URL: https://7x5b7rvyu72urovykdvblcrzhm0joiqw.lambda-url.us-east-1.on.aws/

```bash
curl -X POST https://7x5b7rvyu72urovykdvblcrzhm0joiqw.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" -d '{"sessionId":"6a6e6a72-0349-41da-af4a-47cc97e7fd21"}'
```

Respuesta (200) de una sesión recién creada (todavía no se hizo la prueba):

```json
{"confidence":"No se encontró nivel de confianza","status":"CREATED","referenceImageBase64":"No se encontró imagen de referencia"}
```

Después de hacer la prueba en la app, `status` es `SUCCEEDED`, `confidence` un número de 0 a 100 y
`referenceImageBase64` la imagen del rostro capturado.

## 3. livenessCompareFaces — comparar dos rostros

URL: https://gqmaekjtwnaxb3w7jptk47eq7i0kzesv.lambda-url.us-east-1.on.aws/

```bash
curl -X POST https://gqmaekjtwnaxb3w7jptk47eq7i0kzesv.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{"sourceImage":"<imagen 1 en base64>","targetImage":"<imagen 2 en base64>"}'
```

Respuesta (200):

```json
{"match":true,"similarity":99.8,"threshold":90}
```

Sin imágenes responde 400: `"Faltan sourceImage y targetImage (en base64)"`.
