export interface Patient {
    id: string;
    email: string;
    careGiverEmail?: string;
    identifier?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    provider?: string;
}
export interface PatientSignup {
    id: string;
    nickname: string;
    provider: string;
    activeCareplan: string;
}


export interface LoginRequestDTO {
    email: string,
    password: string,
}

export interface SignupRequestDTO {
    // email: string,
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
}

export type Environment = {
    production: boolean;
    name: 'local' | 'dev' | 'stage' | 'prod';
    gqlEndpoint: string;
    servicesEndpoint: string;
    activityEndpoint: string;
    cognitoURL: string;
    cognitoClientId: string;
}