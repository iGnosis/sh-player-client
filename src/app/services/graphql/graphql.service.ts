import { Injectable } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { environment } from "src/environments/environment";
import { JwtService } from "../jwt.service";

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  public client: GraphQLClient = new GraphQLClient(environment.gqlEndpoint, {
    headers: {
      Authorization: "Bearer " + _getItem("token"),
    },
  });
  public publicClient: GraphQLClient = new GraphQLClient(
    environment.gqlEndpoint,
    {}
  );

  constructor(private jwtService: JwtService) {
    this.jwtService.watchToken().subscribe((token: string) => {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    })}
}
function _getItem(key: string) {
  const value = localStorage.getItem(key);
  return value;
}
