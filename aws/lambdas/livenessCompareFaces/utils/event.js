// Lee los parametros de la invocacion. Acepta:
//  - invocacion directa (SDK / consola): { "sessionId": "..." }
//  - API Gateway: body JSON (o en base64) y/o query string
const readParams = (event = {}) => {
    let body = {};

    if (typeof event.body === 'string') {
        try {
            const texto = event.isBase64Encoded
                ? Buffer.from(event.body, 'base64').toString('utf8')
                : event.body;
            body = JSON.parse(texto);
        } catch {
            body = {};
        }
    } else if (event.body && typeof event.body === 'object') {
        body = event.body;
    }

    return { ...event, ...(event.queryStringParameters || {}), ...body };
};

module.exports = { readParams };
