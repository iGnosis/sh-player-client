// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'stage',
  playerClientUrl: 'https://patient.stage.pointmotioncontrol.com',
  organizationName: 'pointmotion',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.stage.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.stage.pointmotioncontrol.com',
  activityEndpoint: 'https://session.stage.pointmotioncontrol.com',
  providerEndpoint: 'https://provider.stage.pointmotioncontrol.com/',
  websocketEndpoint: 'wss://services.stage.pointmotioncontrol.com',
  stripePublishableKey: 'pk_test_51MSP9MKrHxGkv6aRSuMbHMDH0kNYYhWlYyFgtYNhw9S3UxARQ8WjABwWZdRXuJtMAuSl9st9RzInVuPzyFfclYLR00UCyYpwfK',
  novuAppId: 'E7N-OVEhENfa',
  novuBackendUrl: 'https://api.ma.pointmotioncontrol.com',
  novuSocketUrl: 'https://ws.ma.pointmotioncontrol.com',
};
