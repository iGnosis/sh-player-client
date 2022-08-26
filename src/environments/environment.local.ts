import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'local',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'http://localhost:4201/',
};
