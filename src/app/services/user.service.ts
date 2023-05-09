import { Injectable } from '@angular/core';
import { ErpNextEventTypes, Patient } from '../types/pointmotion';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  patientForm?: Patient;

  constructor(
    private gqlService: GraphqlService,
    private http: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}')
  }

  set(user?: Patient) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user) || '')
  }

  get(): Patient {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}')
    return user as Patient
  }

  fetchCountry(): Observable<{
    country: string;
  }> {
    return this.http.get<{ country: string }>('https://ipinfo.io/json?token=72e8087d68fd80');
  }

  async fetchCountryPhone(code: string): Promise<{
    phone: number;
    name: string;
    emoji: string;
  }> {
    const resp = await this.gqlService.gqlRequest(GqlConstants.FETCH_COUNTRY, {
      code
    }, false)
    return resp.country;
  }

  async savePatientFormDetails() {
    try {
      const patient = await this.gqlService.gqlRequest(
        GqlConstants.UPDATE_PATIENT_DETAILS,
        this.patientForm ? {...this.patientForm} : {},
        true
      );
      return patient.update_patient_by_pk;
    } catch (e) {
      console.error(e);
    }
  }

  async isOnboarded() {
    const user = this.get()

    if (!user || !user.id) {
      throw new Error('User not set');
    }

    const response = await this.gqlService.gqlRequest(GqlConstants.GET_PATIENT_DETAILS, { user: user.id });
    try {
      await this.gqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_DETAILS);
      await this.gqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_STATUS);
    } catch (e: any) {
      if (!e.message.includes("Cannot read properties of undefined (reading 'subscription')")) {
        console.log(e);
        return 'finish';
      } else {
        return 'payment';
      }
    }


    if (response && response.patient_by_pk) {
      if (!response.patient_by_pk.firstName || !response.patient_by_pk.lastName) {
        return 'profile';
      } else if (!response.patient_by_pk.email.value) {
        return 'email';
      } else {
        return 'finish'; // skipping the onboarding
      }
    } else {
      return 'finish'; // skipping the onboarding
    }
  }

  async sendUserFeedback(rating: number, description?: string) {
    const user = this.get()
    if (user && user.id) {
      const response = await this.gqlService.gqlRequest(GqlConstants.USER_FEEDBACK, { description, rating })
      return response.insert_patient_feedback.returning[0].id;
    } else {
      throw new Error('User not set');
    }
  }

  async sendRecommendationScore(feedbackId: string, recommendationScore: number) {
    const user = this.get()
    if (user && user.id) {
      const response = await this.gqlService.gqlRequest(GqlConstants.SET_RECOMMENDATION_SCORE, { feedbackId, recommendationScore })
      return response.update_patient_feedback_by_pk.id;
    } else {
      throw new Error('User not set');
    }
  }

  async updateTimezone(timezone: string) {
    const user = this.get();
    if (!user || !user.id) {
      throw new Error('User not set');
    }
    this.gqlService.gqlRequest(GqlConstants.UPDATE_TIMEZONE, { id: user.id, timezone })
  }

  async appAccessed() {
    console.log('app accessed event sent');
    this.gqlService.gqlRequest(GqlConstants.APP_ACCESSED);
  }

  async erpNextEvent(eventType: ErpNextEventTypes) {
    if (eventType === ErpNextEventTypes.FEEDBACK) {
      console.log('fab feedback event sent');
      this.gqlService.gqlRequest(GqlConstants.FEEDBACK_FORM_FILLED);
    } else if (eventType === ErpNextEventTypes.SUPPORT) {
      console.log('contact support event sent');
      this.gqlService.gqlRequest(GqlConstants.SUPPORT_FORM_FILLED);
    }
  }
}
