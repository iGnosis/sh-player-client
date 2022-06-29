import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'patient-provider';
  timer: any;
  
  constructor(
    private jwtService: JwtService, 
    private authService: AuthService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    if(!this.jwtService.getToken() || this.jwtService.getToken() === "") {
      this.jwtService.watchToken().pipe(take(1)).subscribe((token: string) => {
        this.jwtService.setToken(token);
        this.jwtService.setAuthTokens({id_token: token});
        this.refreshTokenIfExpired();
      })
    } else {
      this.refreshTokenIfExpired();
    }
    this.router.events.subscribe((val: any) => {
      if(val.urlAfterRedirects && val.urlAfterRedirects === '/public/start') {
        clearTimeout(this.timer);
      }
    })
  }
  
  refreshTokenIfExpired() {
    if(!this.jwtService.getToken()) return;
    let expiringIn: number = this.jwtService.tokenExpiry();
    this.timer = setTimeout(() => this.resetTokenOnInterval(), expiringIn);
  }
  async resetTokenOnInterval() {
    const newToken = await this.authService.refreshTokens(this.jwtService.getAuthTokens().refresh_token);
    this.jwtService.setToken(newToken.data.IdToken);
    this.jwtService.setAuthTokens({
      id_token: newToken.data.IdToken,
      access_token: newToken.data.AccessToken,
      expires_in: newToken.data.ExpiresIn,
    });
    let expiringIn: number = this.jwtService.tokenExpiry();
    this.timer = setTimeout(() => this.resetTokenOnInterval(), expiringIn);
  }
}
