import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  public auth0Client: Auth0Client = new Auth0Client(
    {
      domain: environment.auth0Domain,
      client_id: environment.auth0ClientId,
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      audience: environment.auth0Audience,
      scope: environment.auth0Scope
    }
  );

  constructor(private router: Router) {
    createAuth0Client({
      domain: environment.auth0Domain,
      client_id: environment.auth0ClientId,
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      audience: environment.auth0Audience,
      scope: environment.auth0Scope
    }).then((auth0) => {
      this.auth0Client = auth0;
      this.auth0Client.isAuthenticated().then((status) => {
        if (status) {
          console.log('user is authenticated...')
          this.router.navigate(['/app/home'])
        } else {
          console.log('user not authenticated...')
        }
      })
    })
  }
}
