import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
  }
}

export interface Patient {
  id: string;
  email?: string;
  careGiverEmail?: string;
  identifier?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  provider?: string;
  firstName?: string;
  lastName?: string;
  salutation?: string;
}
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface SetPatientDetailsRequestDTO {
  email?: string;
  // password: string,
  nickname: string;
  // code: string,
}

export interface SetPatientProfileRequestDTO {
  namePrefix?: string;
  firstName?: string;
  lastName?: string;
}

export interface LogoutRequestDTO {
  refreshToken: string;
}

export interface RewardsDTO {
  tier: 'bronze' | 'silver' | 'gold';
  isViewed: boolean;
  isUnlocked: boolean;
  isAccessed: boolean;
  description: string;
  unlockAtDayCompleted: number;
  couponCode: string;
}

export type Environment = {
  production: boolean;
  name: 'local' | 'dev' | 'stage' | 'prod';
  playerClientUrl: string,
  organizationName: string;
  gqlEndpoint: string;
  servicesEndpoint: string;
  activityEndpoint: string;
  providerEndpoint: string;
  googleAnalyticsTrackingID: string;
  stripePublishableKey: string;
  websocketEndpoint: string;
  novuAppId: string;
  novuBackendUrl: string;
  novuSocketUrl: string;
};

export interface DailyGoalsApiDTO {
  /**
   * Name of the game. eg. Sit Stand Achieve or Beat Boxer
   */
  name: string;
  /**
   * A boolean value that indicates whether a game has been completed or not.
   */
  isCompleted: boolean;
}

export enum session {
  Start,
  Continue,
  Completed,
  Locked,
}

export enum ErpNextEventTypes {
  SUPPORT = 'support',
  FEEDBACK = 'feedback',
}

export interface Theme {
  colors: {
    [key: string]: any;
  };
  font: {
    family: string;
    url: string;
  };
}

export interface ModalConfig {
  type?: 'primary' | 'warning' | 'input';
  title?: string;
  body?: string;
  inputPlaceholder?: string;
  closeButtonLabel?: string;
  submitButtonLabel?: string;
  onClose?(): Promise<boolean> | boolean | void;
  onSubmit?(): Promise<boolean> | boolean | void;
}

export const Genres = ['classical', 'jazz', 'rock', 'dance', 'surprise-me'];

// adding afro to genres only in dev environment
if (environment.name === 'dev' || environment.name === 'local') {
  Genres.push('afro');
}

export type Genre = typeof Genres[number];
