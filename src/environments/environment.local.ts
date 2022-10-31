import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'local',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'http://localhost:8080/v1/graphql',
  servicesEndpoint: 'http://localhost:9000',
  activityEndpoint: 'http://localhost:4201/',
};
