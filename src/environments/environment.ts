// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // URLs (Function URL) de las 3 Lambdas en AWS, región us-east-1
  lambdas: {
    crearSesion: 'https://vlv66l7ka2c5udim2lek656oga0fytfc.lambda-url.us-east-1.on.aws/',  // livenessGetSessionId (CreateFaceLivenessSession)
    resultados: 'https://7x5b7rvyu72urovykdvblcrzhm0joiqw.lambda-url.us-east-1.on.aws/',  // livenessGetSessionResults (GetFaceLivenessSessionResults)
    comparar: 'https://gqmaekjtwnaxb3w7jptk47eq7i0kzesv.lambda-url.us-east-1.on.aws/',  // livenessCompareFaces (CompareFaces)
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
