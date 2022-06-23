import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
    production: false,
    name: 'local',
    gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
    servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
    activityEndpoint: 'http://localhost:4201/',
    cognitoURL: 'https://pointmotion-dev-sh-patient-1.auth.us-east-1.amazoncognito.com',
    cognitoClientId: '6dipj647dhgqom410jfe2gusem'
  };
  