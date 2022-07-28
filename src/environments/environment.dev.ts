// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'dev',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'https://session.dev.pointmotioncontrol.com',
  cognitoURL: 'https://pointmotion-dev-sh-patient-1.auth.us-east-1.amazoncognito.com',
  cognitoClientId: '6dipj647dhgqom410jfe2gusem',
  auth0Domain: 'dev--os8qz4a.us.auth0.com',
  auth0ClientId: 'ih7Um6SvveMSxudXkmzA3h6vOT7cBElL',
  auth0Audience: 'https://services.dev.pointmotioncontrol.com/',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'https://patient.dev.pointmotioncontrol.com/oauth/callback',
  auth0LogoutUrl: 'https://patient.dev.pointmotioncontrol.com'
};

/*
  * For easier debugging in development mode, you can import the following file
  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
  *
  * This import should be commented out in production mode because it will have a negative impact
  * on performance if an error is thrown.
  */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
