import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from 'src/environments/environment';
import { GqlConstants } from './gql-constants/gql-constants.constants';
import { GraphqlService } from './graphql/graphql.service';
import { LoginRequestDTO, SignupRequestDTO } from '../types/pointmotion';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = ''
  constructor(private http: HttpClient, private graphqlService: GraphqlService, private userService: UserService) {
    this.baseURL = environment.servicesEndpoint
  }

  login(details: LoginRequestDTO) {
    return this.http.post(this.baseURL+'/auth/patient/login', details)
  }

  async setNickName(details: SignupRequestDTO) {
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

  async signup(details: SignupRequestDTO) {
    try {
      const user = this.userService.get()
      const data = {
        nickname: details.nickname,
        email: details.email,
        id: user.id
      }
      const res = await this.graphqlService.gqlRequest(GqlConstants.SET_PATIENT_DETAILS, data);
      return res;
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
