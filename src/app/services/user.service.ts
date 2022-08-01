import { Injectable } from '@angular/core';
import { Patient } from '../types/pointmotion';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  constructor(private gqlService: GraphqlService) {
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

  async isOnboarded() {
    const user = this.get()

    if (!user || !user.id) {
      throw new Error('User not set');
    }

    const response = await this.gqlService.gqlRequest(GqlConstants.GET_PATIENT_DETAILS, { user: user.id })

    if (response && response.patient_by_pk) {
      if (!response.patient_by_pk.nickname) {
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

}