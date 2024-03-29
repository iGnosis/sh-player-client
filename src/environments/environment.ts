// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'local',
  organizationName: 'pointmotion',
  playerClientUrl: 'https://patient.dev.pointmotioncontrol.com',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'https://session.dev.pointmotioncontrol.com',
  providerEndpoint: 'https://provider.dev.pointmotioncontrol.com/',
  websocketEndpoint: 'wss://services.dev.pointmotioncontrol.com',
  stripePublishableKey: 'pk_test_51MSP9MKrHxGkv6aRSuMbHMDH0kNYYhWlYyFgtYNhw9S3UxARQ8WjABwWZdRXuJtMAuSl9st9RzInVuPzyFfclYLR00UCyYpwfK',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
