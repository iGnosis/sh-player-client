import { Injectable } from '@angular/core';
import { Patient } from '../types/pointmotion';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  constructor(private gqlService: GraphqlService, private http: HttpClient) {
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

  fetchCountry() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://ipinfo.io/country?token=72e8087d68fd80',
      {
        headers,
        responseType: 'text'
      }
    );
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

    const response = await this.gqlService.gqlRequest(GqlConstants.GET_PATIENT_DETAILS, { user: user.id })

    if (response && response.patient_by_pk) {
      if (!response.patient_by_pk.email) {
        return 2;
      } else if (!response.patient_by_pk.nickname) {
        return 3;
      } else if (!response.patient_by_pk.preferredGenres) {
        return 4;
      } else {
        return -1; // -1 is a status for skipping the onboarding
      }
    } else {
      return 4; // Send the user to step 4 directly
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