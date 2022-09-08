import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class CareplanService {
  constructor(private graphqlService: GraphqlService) {}

  async getAvailableGames() {
    const games = await this.graphqlService.gqlRequest(
      GqlConstants.GET_AVAILABLE_GAMES
    );
    return games;
  }
}
