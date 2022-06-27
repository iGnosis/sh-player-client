import { Component, OnInit } from '@angular/core';
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
  
  constructor(private jwtService: JwtService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.jwtService.watchToken().pipe(take(1)).subscribe((token: string) => {
      this.jwtService.setToken(token);
    })
    if(this.jwtService.getToken()) {
      this.refreshTokenIfExpired();
    }
  }
  
  refreshTokenIfExpired() {
    if(!this.jwtService.getToken()) return;
    let expiringIn: number = this.jwtService.tokenExpiry();
    console.log(expiringIn);
    setTimeout(() => this.resetTokenOnInterval(), expiringIn);
  }
  async resetTokenOnInterval() {
    const newToken = await this.authService.refreshTokens(this.jwtService.getAuthTokens().refresh_token);
    this.jwtService.setToken(newToken.data.IdToken);
    let expiringIn: number = this.jwtService.tokenExpiry();
    setTimeout(() => this.resetTokenOnInterval(), expiringIn);
  }
}
