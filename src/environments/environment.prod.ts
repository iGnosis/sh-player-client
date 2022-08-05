import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.pointmotioncontrol.com',
  activityEndpoint: 'https://session.pointmotioncontrol.com',
  auth0Domain: 'dev--os8qz4a.us.auth0.com',
  auth0ClientId: 'ih7Um6SvveMSxudXkmzA3h6vOT7cBElL',
  auth0Audience: 'https://services.prod.pointmotioncontrol.com/',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'https://patient.dev.pointmotioncontrol.com/oauth/callback',
  auth0LogoutUrl: 'https://patient.dev.pointmotioncontrol.com'
};
