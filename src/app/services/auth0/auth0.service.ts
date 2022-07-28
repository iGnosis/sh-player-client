import { Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  public auth0Client: Auth0Client;

  constructor() {
    console.log('Auth0Service:init')
    this.auth0Client = new Auth0Client({
      domain: environment.auth0Domain,
      client_id: environment.auth0ClientId,
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      audience: environment.auth0Audience,
      scope: environment.auth0Scope
    })
  }
}
