import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import jwtDecode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private jwt?: string
  private currentToken = new Subject<string>();
  private TOKEN = 'token'
  
  constructor() {
    this.jwt = localStorage.getItem(this.TOKEN) || ''
  }

  watchToken(): Observable<any> {
    return this.currentToken.asObservable();
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN) || ''
  }

  setToken(token: string) {
    this.currentToken.next(token);
    localStorage.setItem(this.TOKEN, token)
  }

  setAuthTokens(data: {access_token: string, id_token: string, refresh_token: string, expires_in: number, token_type: string}) {
    localStorage.setItem('auth', JSON.stringify(data))
  }

  getAuthTokens() {
    return JSON.parse(localStorage.getItem('auth') || '{}')
  }

  checkCareplanAndProviderInJWT() {
    const decodedToken: any = jwtDecode(this.getToken());
    const hasuraJWTClaims = JSON.parse(decodedToken["https://hasura.io/jwt/claims"] as string);
   if (
     "x-hasura-careplan-id" in hasuraJWTClaims &&
     "x-hasura-provider-id" in hasuraJWTClaims
   ) {
     return true;
   } else {
     return false;
   }
  }

}