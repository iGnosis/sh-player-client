import { Injectable } from "@angular/core";
import { GqlConstants } from "../gql-constants/gql-constants.constants";
import { GraphqlService } from "../graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(private graphqlService: GraphqlService) {}

  async createNewSession(
    userId: string,
    careplanId: string
  ): Promise<string | undefined> {
    const session = await this.new(userId, careplanId);
    if (session && session.insert_session_one) {
      const sessionId = session.insert_session_one.id;
      return sessionId;
    }
    return;
  }

  new(patient: string, careplan: string) {
    return this.graphqlService.client.request(GqlConstants.CREATE_SESSION, {
      patient,
      careplan,
    });
  }
}
