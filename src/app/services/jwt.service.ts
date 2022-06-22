import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
}