import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Auth0Service } from './auth0/auth0.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private currentToken = new Subject<string>();

  constructor(private auth0Service: Auth0Service) { }

  watchToken(): Observable<any> {
    return this.currentToken.asObservable();
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