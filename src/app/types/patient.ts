export interface Patient {
    id: string;
    email: string;
    careGiverEmail?: string;
    identifier?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    provider: string;
}
export interface PatientSignup {
    id: string;
    nickname: string;
    provider: string;
    activeCareplan: string;
}