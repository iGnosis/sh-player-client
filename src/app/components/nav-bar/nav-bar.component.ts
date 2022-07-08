import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  hideNavbar: boolean = false;
  constructor(
    private route:Router,
    private jwtService: JwtService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.subscribe(() => {
      this.activeTab = this.route.url.split('/').slice(-1)[0];
      if (this.route.url.split('/')[2] === 'signup') this.hideNavbar = true;
      else this.hideNavbar = false;
    })
  }

  ngOnInit(): void {
  }

  async logout() {
    const tokens = this.jwtService.getAuthTokens();
    if (tokens && tokens.refresh_token) {
      await this.authService.logout({ refreshToken: tokens.refresh_token });
    };
    this.jwtService.clearAuthTokens();
    this.userService.setPatient();
    this.userService.set();
    this.router.navigate(['/']);
  }

}
