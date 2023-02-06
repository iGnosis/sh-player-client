import { Environment } from "src/app/types/pointmotion";

// pure local env
// all the endpoints are set to localhost servers
export const environment: Environment = {
  production: false,
  name: 'local',
  organizationName: 'pointmotion',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'http://localhost:8080/v1/graphql',
  servicesEndpoint: 'http://localhost:9000',
  activityEndpoint: 'http://localhost:4201/',
  providerEndpoint: 'http://localhost:4200/',
  websocketEndpoint: 'ws://localhost:9000',
  stripePublishableKey: 'pk_test_51MSP9MKrHxGkv6aRSuMbHMDH0kNYYhWlYyFgtYNhw9S3UxARQ8WjABwWZdRXuJtMAuSl9st9RzInVuPzyFfclYLR00UCyYpwfK',
};
