import { Injectable } from '@angular/core';
import { GqlConstants } from '../gql-constants/gql-constants.constants';
import { GraphqlService } from '../graphql/graphql.service';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(private graphqlService: GraphqlService) { }

  // pinpoint event
  async faqAccessed() {
    try {
      this.graphqlService.client.request(GqlConstants.SOUNDHEALTH_FAQ_ACCESSED);
    } catch (e) {
      console.log(e);
    }
  }

  // pinpoint event
  async freeParkinsonResourcesAccessed() {
    try {
      this.graphqlService.client.request(GqlConstants.FREE_PARKINSON_RESOURCES_ACCESSED);
    } catch (e) {
      console.log(e);
    }
  }

  // pinpoint event
  async freeRewardAccessed() {
    try {
      this.graphqlService.client.request(GqlConstants.FREE_REWARD_ACCESSED);
    } catch (e) {
      console.log(e);
    }
  }
}
