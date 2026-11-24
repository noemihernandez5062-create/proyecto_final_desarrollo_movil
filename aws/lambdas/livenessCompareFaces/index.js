const { compareFaces } = require('./services/rekognition');
const { buildResponse } = require('./utils/response');
const { readParams } = require('./utils/event');

// Errores de Rekognition causados por las imagenes recibidas (no por el servidor)
const ERRORES_DE_IMAGEN = [
    'InvalidParameterException',   // no se detecto un rostro
    'InvalidImageFormatException', // formato no soportado (solo JPEG o PNG)
    'ImageTooLargeException'       // mas de 5 MB
];

exports.handler = async (event) => {
    const { sourceImage, targetImage, similarityThreshold } = readParams(event);

    if (!sourceImage || !targetImage) {
        return buildResponse(400, 'Faltan sourceImage y targetImage (en base64)');
    }

    try {
        const resultado = await compareFaces(sourceImage, targetImage, similarityThreshold);
        console.log('Comparacion:', resultado.match, resultado.similarity);
        return buildResponse(200, resultado);
    } catch (error) {
        console.log('Error:', error);

        if (ERRORES_DE_IMAGEN.includes(error.name)) {
            return buildResponse(400, 'No se detecto un rostro valido en alguna de las imagenes');
        }
        return buildResponse(500, 'Error al comparar los rostros');
    }
};
