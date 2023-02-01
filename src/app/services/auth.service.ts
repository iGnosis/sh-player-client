import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';
import { LoginRequestDTO, SetPatientDetailsRequestDTO, SetPatientProfileRequestDTO } from '../types/pointmotion';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = ''
  constructor(private gqlService: GraphqlService, private http: HttpClient, private graphqlService: GraphqlService, private userService: UserService) {
    this.baseURL = environment.servicesEndpoint
  }

  login(details: LoginRequestDTO) {
    return this.http.post(this.baseURL+'/auth/patient/login', details)
  }

  async setNickName(details: SetPatientDetailsRequestDTO) {
    try {
      const user = this.userService.get()
      const data = {
        nickname: details.nickname,
        id: user.id
      }
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_NICKNAME, data);
      return res;
    } catch(e) {
      return e;
    }
  }

  async getPaymentMethodRequirement() {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.GET_PAYMENT_METHOD_REQUIREMENT);
      return res.subscription_plans[0].requirePaymentDetails;
    } catch(e) {
      return e;
    }
  }

  async getSubscriptionPlanDetails() {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_PLAN_DETAILS);
      return res.subscription_plans[0];
    } catch(e) {
      return e;
    }
  }
  

  async getPaymentAuthUrl() {
    try {
      const subscription = await this.getSubscriptionDetails();
      const res = await this.graphqlService.gqlRequest(GqlConstants.GET_PAYMENT_AUTH_URL, {subscriptionId: subscription.id});
      return res.subscriptions[0].paymentAuthUrl;
    } catch(e) {
      console.error(e);
    }
  }
  

  async getSubscriptionStatus() {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_STATUS);
      return res.getSubscriptionStatus.data;
    } catch(e) {
      return e;
    }
  }

  async getSubscriptionDetails() {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.GET_SUBSCRIPTION_DETAILS);
      return res.getSubscriptionDetails.subscription;
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  private async createStripeCustomer() {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.CREATE_CUSTOMER);
      return res;
    } catch(e) {
      return e;
    }
  }

  async setPatientDetails(details: SetPatientDetailsRequestDTO) {
    try {
      const user = this.userService.get()
      const data = {
        nickname: details.nickname,
        email: details.email,
        id: user.id
      }
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_PATIENT_DETAILS, data);

      await this.createStripeCustomer();
      return res;
    } catch(e) {
      return e;
    }
  }

  async setPatientProfile(details: SetPatientProfileRequestDTO) {
    try {
      const user = this.userService.get();
      const data = {
        ...details,
        id: user.id
      };
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_PATIENT_PROFILE, data);
      return res;
    } catch(e) {
      return e;
    }
  }

  async setPatientEmail(email: string) {
    try {
      const user = this.userService.get();
      const data = {
        email,
        id: user.id
      };
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_PATIENT_EMAIL, data);

      await this.createStripeCustomer();
      return res;
    } catch(e) {
      return e;
    }
  }

  async getPatientDetails() {
    try {
      const patientId = this.userService.get().id;
      const patient = await this.gqlService.gqlRequest(
        GqlConstants.GET_PATIENT_DETAILS,
        {
          user: patientId,
        },
        true
      );
      return patient.patient_by_pk;
    } catch(e) {
      return e;
    }
  }

  async setPreferredGenres(details: {id: string, genres: any}) {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_FAV_GENRE, details)
      return res;
    } catch(e) {
      return e;
    }
  }

  async setPreferredActivities(details: {id: string, activities: any}) {
    try {
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_FAV_ACTIVITIES, details);
      return res;
    } catch(e) {
      return e;
    }
  }
}
