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
}
export interface LoginRequestDTO {
  email: string,
  password: string,
}

export interface SetPatientDetailsRequestDTO {
  email?: string,
  // password: string,
  nickname: string,
  // code: string,
}

export interface LogoutRequestDTO {
  refreshToken: string,
}

export interface RewardsDTO {
  tier: "bronze" | "silver" | "gold";
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
  organizationName: string;
  gqlEndpoint: string;
  servicesEndpoint: string;
  activityEndpoint: string;
  providerEndpoint: string;
  googleAnalyticsTrackingID: string;
}

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

export enum session { Start, Continue, Completed, Locked }

export interface Theme {
  colors: {
    [key: string]: any;
  };
  font: {
    family: string;
    url: string;
  }
}
