import { Environment } from "src/app/types/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'prod',
  playerClientUrl: 'https://patient.imnf.pointmotioncontrol.com',
  organizationName: 'imnf',
  googleAnalyticsTrackingID: 'G-MTGG72G6ND',
  gqlEndpoint: 'https://api.prod.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.prod.pointmotioncontrol.com',
  activityEndpoint: 'https://session.imnf.pointmotioncontrol.com',
  providerEndpoint: 'https://provider.imnf.pointmotioncontrol.com/',
  websocketEndpoint: 'wss://services.prod.pointmotioncontrol.com',
  stripePublishableKey: 'pk_live_51MSP9MKrHxGkv6aRnWQHqLlx84OnFxBSStSuycGpLO4grZW92ZPu6HoHuZ6ZNNai9JnjaMdPhYoTCi4Wi1MTC3JX00ojfqd6hD',
};
