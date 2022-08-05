// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'stage',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.stage.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.stage.pointmotioncontrol.com',
  activityEndpoint: 'https://session.stage.pointmotioncontrol.com',
  auth0Domain: 'pointmotion-stage.us.auth0.com',
  auth0ClientId: 'WitNXSUpiq3POQRta8k6uSPO0h1sGuug',
  auth0Audience: 'https://app.pointmotion.us',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'https://app.pointmotion.us/oauth/callback',
  auth0LogoutUrl: 'https://app.pointmotion.us'
};
