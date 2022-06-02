import { Injectable } from "@angular/core";
import { GqlConstants } from "../gql-constants/gql-constants.constants";
import { GraphqlService } from "../graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(private graphqlService: GraphqlService) {}

  async createNewSession(careplanId: string): Promise<string | undefined> {
    const session = await this.new(careplanId);
    if (session && session.insert_session_one) {
      const sessionId = session.insert_session_one.id;
      return sessionId;
    }
    return;
  }

  new(careplan: string) {
    return this.graphqlService.client.request(GqlConstants.CREATE_SESSION, {
      careplan,
    });
  }
}
