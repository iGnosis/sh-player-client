import { Environment } from "src/app/types/pointmotion";

// default local env
// use dev servers except for the activityEndpoint for easier debugging
export const environment: Environment = {
  production: false,
  name: 'local',
  organizationName: 'pointmotion',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'http://localhost:4201/',
  providerEndpoint: 'https://provider.dev.pointmotioncontrol.com/',
  stripePublishableKey: 'pk_test_51MSP9MKrHxGkv6aRSuMbHMDH0kNYYhWlYyFgtYNhw9S3UxARQ8WjABwWZdRXuJtMAuSl9st9RzInVuPzyFfclYLR00UCyYpwfK',
};
