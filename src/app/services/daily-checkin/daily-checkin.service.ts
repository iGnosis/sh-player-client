import { Injectable } from '@angular/core';
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class DailyCheckinService {
  constructor(
    private gqlService: GraphqlService,
    private userService: UserService
  ) {}

  async dailyCheckin(type: string, value: string) {
    const user = this.userService.get()
    if (user && user.id) {
      const response = await this.gqlService.client.request(GqlConstants.USER_DAILY_CHECKIN, {type, value});
      return response;
    } else {
      throw new Error('User not set');
    }
  }

  async getLastCheckin() {
    const user = this.userService.get()
    if (user && user.id) {
      const response = await this.gqlService.client.request(GqlConstants.GET_LAST_CHECKIN);
      return response;
    } else {
      throw new Error('User not set');
    }
  }
}