// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: false,
  name: 'stage',
  gqlEndpoint: 'https://api.stage.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.stage.pointmotioncontrol.com',
  activityEndpoint: 'https://session.stage.pointmotioncontrol.com',
  cognitoURL: 'https://pointmotion-stage-sh-patient.auth.us-east-1.amazoncognito.com',
  cognitoClientId: '4sk7ie58ca65cu7jn2rlgpgjoq'
};
