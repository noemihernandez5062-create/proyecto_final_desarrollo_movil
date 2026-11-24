const { RekognitionClient, CompareFacesCommand } = require('@aws-sdk/client-rekognition');

const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

// Similitud minima (0-100) para considerar que es la misma persona
const UMBRAL_POR_DEFECTO = 90;

// sourceBase64: rostro a buscar (p. ej. la foto de referencia de Liveness)
// targetBase64: imagen donde se busca (p. ej. la foto de perfil guardada)
const compareFaces = async (sourceBase64, targetBase64, umbral = UMBRAL_POR_DEFECTO) => {
    const command = new CompareFacesCommand({
        SourceImage: { Bytes: Buffer.from(sourceBase64, 'base64') },
        TargetImage: { Bytes: Buffer.from(targetBase64, 'base64') },
        SimilarityThreshold: Number(umbral)
    });
    const response = await rekognitionClient.send(command);

    // Rekognition solo devuelve en FaceMatches los rostros que superan el umbral
    const mejor = (response.FaceMatches || [])
        .sort((a, b) => b.Similarity - a.Similarity)[0];

    return {
        match: Boolean(mejor),
        similarity: mejor ? mejor.Similarity : 0,
        threshold: Number(umbral)
    };
};

module.exports = { compareFaces };
