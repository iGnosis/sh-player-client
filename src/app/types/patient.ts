export interface Patient {
    id: string;
    email: string;
    careGiverEmail?: string;
    identifier?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
}