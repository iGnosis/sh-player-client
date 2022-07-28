import { Injectable } from "@angular/core";
import { GqlConstants } from "../gql-constants/gql-constants.constants";
import { GraphqlService } from "../graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(private graphqlService: GraphqlService) {}

  async createNewSession() {
    const session = await this.graphqlService.gqlRequest(GqlConstants.CREATE_SESSION);
      if (session && session.insert_session_one) {
        const sessionId = session.insert_session_one.id;
        return sessionId;
      }
  }
}
