import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  organizationName: 'imnf',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.prod.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.prod.pointmotioncontrol.com',
  activityEndpoint: 'https://session.imnf.pointmotioncontrol.com',
  providerEndpoint: 'https://provider.imnf.pointmotioncontrol.com/',
};
