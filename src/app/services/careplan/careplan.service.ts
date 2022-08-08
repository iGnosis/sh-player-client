import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class CareplanService {
  constructor(private graphqlService: GraphqlService) {}

  async getActiveCareplans(patientId?: string) {
    const activeCareplans = await this.graphqlService.gqlRequest(
      GqlConstants.GET_ACTIVE_PLANS
    );
    console.log("active careplans", activeCareplans);
    return activeCareplans;
  }
  async getCareplanActivities() {
    const activities = await this.graphqlService.gqlRequest(
      GqlConstants.GET_CAREPLAN_DETAILS
    );
    return activities;
  }

  async getAvailableGames() {
    const games = await this.graphqlService.gqlRequest(
      GqlConstants.GET_AVAILABLE_GAMES
    );
    return games;
  }
}
