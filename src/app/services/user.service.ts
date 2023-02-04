import { Injectable } from '@angular/core';
import { Patient } from '../types/pointmotion';
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

  async isOnboarded() {
    const user = this.get()

    if (!user || !user.id) {
      throw new Error('User not set');
    }

    const response = await this.gqlService.gqlRequest(GqlConstants.GET_PATIENT_DETAILS, { user: user.id });
    let subscriptionResponse, statusResponse;
    try {
      subscriptionResponse = await this.gqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_DETAILS);
      statusResponse = await this.gqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_STATUS);
    } catch (e) {
      console.error(e);
    }


    if (response && response.patient_by_pk) {
      if (!response.patient_by_pk.firstName || !response.patient_by_pk.lastName) {
        return 'profile';
      } else if (!response.patient_by_pk.email) {
        return 'email';
      } else if (!subscriptionResponse.getSubscriptionDetails || !subscriptionResponse.getSubscriptionDetails.subscription || statusResponse.getSubscriptionStatus.data !== 'active') {
        return 'payment';
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
}