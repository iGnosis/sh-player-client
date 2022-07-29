import { Injectable } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { environment } from "src/environments/environment";
import { Auth0Service } from "../auth0/auth0.service";
import { JwtService } from "../jwt.service";

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  public client: GraphQLClient
  public publicClient: GraphQLClient

  constructor(private jwtService: JwtService) {

    setTimeout(() => {
      this.jwtService.getToken();
      setInterval(() => {
        this.jwtService.getToken();
      }, 1000 * 60 * 15);
    }, 0)

    const additionalHeaders: any = {
      'x-pointmotion-origin': window.location.origin,
      'x-pointmotion-user': 'patient',
    }
    if (environment.name == 'local') {
      additionalHeaders['x-pointmotion-debug'] = 'true'
    }

    this.client = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign({
        Authorization: "Bearer " + this.jwtService.getToken(),
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
    })
  }

  async gqlRequest(query: string, variables: any = {}, auth: boolean = true, additionalHeaders: any = {}) {

    additionalHeaders['x-pointmotion-origin'] = window.location.origin
    additionalHeaders['x-pointmotion-user'] = 'patient'


    if (environment.name == 'local') {
      additionalHeaders['x-pointmotion-debug'] = 'true'
    }

    // make authenticated request.
    if (auth) {
      const token = await this.jwtService.getToken();
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign({
          Authorization: "Bearer " + token,
          ...additionalHeaders
        })
      });
    }

    else {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: {
          ...additionalHeaders
        }
      });
    }

    return await this.client.request(query, variables);
  }
}
