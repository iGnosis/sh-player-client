import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'local',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'http://localhost:4201/',
  auth0Domain: 'dev--os8qz4a.us.auth0.com',
  auth0ClientId: 'ih7Um6SvveMSxudXkmzA3h6vOT7cBElL',
  auth0Audience: 'https://services.dev.pointmotioncontrol.com/',
  auth0Scope: 'openid profile email offline_access',
  auth0CbUrl: 'http://localhost:4300/oauth/callback',
  auth0LogoutUrl: 'http://localhost:4300'
};
