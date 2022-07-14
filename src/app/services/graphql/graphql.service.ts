import { Injectable } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { environment } from "src/environments/environment";
import { JwtService } from "../jwt.service";

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  public client: GraphQLClient
  public publicClient: GraphQLClient

  constructor(private jwtService: JwtService) {
    const additionalHeaders: any = {
      'x-pointmotion-origin': window.location.origin,
      'x-pointmotion-user': 'patient',
    }
    if (environment.name == 'local') {
      additionalHeaders['x-pointmotion-debug'] = 'true'
    }

    this.client = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign({
        Authorization: "Bearer " + _getItem("token"),
      }, additionalHeaders),
    });

    this.publicClient = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign({
        }, additionalHeaders)
      }
    );

    this.jwtService.watchToken().subscribe((token: string) => {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign({
          Authorization: "Bearer " + token,
        }, additionalHeaders)
      });
    })}
}
function _getItem(key: string) {
  const value = localStorage.getItem(key);
  return value;
}
