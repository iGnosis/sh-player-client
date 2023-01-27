// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'stage',
  organizationName: 'pointmotion',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.stage.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.stage.pointmotioncontrol.com',
  activityEndpoint: 'https://session.stage.pointmotioncontrol.com',
  providerEndpoint: 'https://provider.stage.pointmotioncontrol.com/',
  stripePublishableKey: 'pk_test_51MCGAoSJ1afwULmmMEUXSrTJaNu7ymt6qKPkqnktBSE71h77qyqHnbQeoYF9XC4YbmetgUAziIm8pb927AxLwukv006ZIttv9m',
};
