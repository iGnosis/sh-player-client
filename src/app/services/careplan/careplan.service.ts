import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class CareplanService {
  constructor(private graphqlService: GraphqlService) {}

  async getActiveCareplans(patientId: string) {
    const activeCareplans = await this.graphqlService.client.request(
      GqlConstants.GET_ACTIVE_PLANS,
      { patient: patientId }
    );
    return activeCareplans;
  }
}
