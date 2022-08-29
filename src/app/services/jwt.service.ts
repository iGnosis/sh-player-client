import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private currentToken = new Subject<string>();
  private tokenSetInterval: any;

  constructor() { }

  watchToken(): Observable<any> {
    return this.currentToken.asObservable();
  }

  isAuthenticated() {
    const accessToken = this.getToken();

    if (!accessToken) {
      return false;
    }

    const decodedToken: {
      iat: number;
      exp: number;
    } = jwtDecode(accessToken);

    const nowUnixEpochInSecs = new Date().getTime() / 1000;
    const diffInSecs = nowUnixEpochInSecs - decodedToken.exp;

    // token stays valid for 24hrs.
    if (diffInSecs >= 0) {
      return false;
    }

    return true;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
  }

  // TODO: Remove this
  async refreshTokenAtIntervalTemp() {
    if (this.tokenSetInterval) {
      clearInterval(this.tokenSetInterval);
    }

    const accessToken = this.getToken();
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
      this.getToken();
    }, interval);

    console.log('tokenSetInterval:set')
  }

  setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    const token = localStorage.getItem('accessToken');
    return token;
  }
}