import { Injectable } from '@angular/core';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  constructor(private graphqlService: GraphqlService) { }

  async getRewards() {
    try {
      const response = await this.graphqlService.client.request(GqlConstants.GET_PATIENT_REWARDS);
      return response.patient[0].rewards;
    } catch (e) {
      console.log(e);
    }
  }

  async markRewardAsAccessed(rewardTier: string) {
    try {
      const response = await this.graphqlService.client.request(GqlConstants.MARK_REWARD_AS_ACCESSED, { rewardTier });
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async markRewardAsViewed(rewardTier: string) {
    try {
      const response = await this.graphqlService.client.request(GqlConstants.MARK_REWARD_AS_VIEWED, { rewardTier });
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
