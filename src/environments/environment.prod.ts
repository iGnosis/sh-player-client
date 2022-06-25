import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  gqlEndpoint: 'https://api.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.pointmotioncontrol.com',
  activityEndpoint: 'https://session.pointmotioncontrol.com',
  cognitoURL: 'https://pointmotion-dev-sh-patient-1.auth.us-east-1.amazoncognito.com',
  cognitoClientId: '24dshjc1umm04bi12eu46ek727'
};
