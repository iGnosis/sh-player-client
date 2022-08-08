import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { Auth0Service } from './auth0/auth0.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private currentToken = new Subject<string>();
  private tokenSetInterval: any;

  constructor(private auth0Service: Auth0Service) { }

  watchToken(): Observable<any> {
    return this.currentToken.asObservable();
  }

  async refreshTokenAtInterval() {
    if (this.tokenSetInterval) {
      clearInterval(this.tokenSetInterval);
    }

    const accessToken = await this.getToken();
    if (!accessToken) return;

    const decodedToken: {
      iat: number;
      exp: number;
    } = jwtDecode(accessToken);

    const { iat, exp } = decodedToken;

    // exp & iat are set in seconds.
    // we attempt to refresh 45seconds before a token has been expired
    // multiply by 1000 to convert it to milliseconds.
    const interval = ((exp - iat) - 45) * 1000

    // every (expiryInMins - 1min)
    this.tokenSetInterval = setInterval(async () => {
      await this.getToken();
    }, interval);

    console.log('tokenSetInterval:set')
  }

  async getToken() {
    const isAuthenticated = await this.auth0Service.auth0Client.isAuthenticated();
    if (!isAuthenticated) {
      return
    }

    try {
      // fetches the latest valid access_token.
      // automatically refreshes a token if it's near expiry or already expired.
      const token = await this.auth0Service.auth0Client.getTokenSilently();

      // notify the observers.
      this.currentToken.next(token);
      return token;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}