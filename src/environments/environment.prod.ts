import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  gqlEndpoint: 'https://api.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.pointmotioncontrol.com',
  activityEndpoint: 'https://session.pointmotioncontrol.com',
};
