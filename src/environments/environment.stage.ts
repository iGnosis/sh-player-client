// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'stage',
  gqlEndpoint: 'https://api.stage.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.stage.pointmotioncontrol.com',
  activityEndpoint: 'https://session.stage.pointmotioncontrol.com',
  auth0Domain: 'pointmotion-stage.us.auth0.com',
  auth0ClientId: 'WitNXSUpiq3POQRta8k6uSPO0h1sGuug',
  auth0Audience: 'https://services.stage.pointmotioncontrol.com/',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'https://patient.stage.pointmotioncontrol.com/oauth/callback',
  auth0LogoutUrl: 'https://patient.stage.pointmotioncontrol.com'
};
