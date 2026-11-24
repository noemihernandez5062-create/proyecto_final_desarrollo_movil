export const environment = {
  production: true,
  // URLs (Function URL) de las 3 Lambdas en AWS, región us-east-1
  lambdas: {
    crearSesion: 'https://vlv66l7ka2c5udim2lek656oga0fytfc.lambda-url.us-east-1.on.aws/',  // livenessGetSessionId (CreateFaceLivenessSession)
    resultados: 'https://7x5b7rvyu72urovykdvblcrzhm0joiqw.lambda-url.us-east-1.on.aws/',  // livenessGetSessionResults (GetFaceLivenessSessionResults)
    comparar: 'https://gqmaekjtwnaxb3w7jptk47eq7i0kzesv.lambda-url.us-east-1.on.aws/',  // livenessCompareFaces (CompareFaces)
  },
};
