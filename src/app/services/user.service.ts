import { Injectable } from '@angular/core';
import { Patient, PatientSignup } from '../types/pointmotion';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  private patient?: PatientSignup
  constructor(private gqlService: GraphqlService) { 
    this.user = JSON.parse(localStorage.getItem('user') || '{}')
    this.patient = JSON.parse(localStorage.getItem('patient') || '{}')
  }

  set(user?: Patient) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user) || '')
  }

  get(): Patient {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}')
    return user as Patient
  }

  setPatient(patient?: PatientSignup) {
    this.patient = patient;
    localStorage.setItem('patient', JSON.stringify(patient) || '')
  }

  getPatient(): PatientSignup {
    const patient = this.patient || JSON.parse(localStorage.getItem('patient') || '{}')
    return patient as PatientSignup
  }

  async isOnboarded() {
    const user = this.get()
    if (user && user.id) {
      const response = await this.gqlService.client.request(GqlConstants.GET_PATIENT_DETAILS, {user: user.id})
      if(response && response.patient_by_pk) {
        if (!response.patient_by_pk.nickname) {
          return 3;
        } else if(!response.patient_by_pk.preferredGenres) {
          return 4;
        } else {
          return -1; // -1 is a status for skipping the onboarding
        }
      } else {
        return 4; // Send the user to step 4 directly
      }
    } else {
      throw new Error('User not set');
    }
  }

  async sendUserFeedback(rating: number, description?: string) {
    const user = this.get()
    if (user && user.id) {
      const response = await this.gqlService.client.request(GqlConstants.USER_FEEDBACK, {description, rating})
      return response.insert_patient_feedback.returning[0].id;
    } else {
      throw new Error('User not set');
    }
  }

  async sendRecommendationScore(feedbackId: string, recommendationScore: number) {
    const user = this.get()
    if (user && user.id) {
      const response = await this.gqlService.client.request(GqlConstants.SET_RECOMMENDATION_SCORE, {feedbackId, recommendationScore})
      return response.update_patient_feedback_by_pk.id;
    } else {
      throw new Error('User not set');
    }
  }

}