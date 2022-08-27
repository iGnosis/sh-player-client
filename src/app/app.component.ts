import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from './services/google-analytics/google-analytics.service';
import { JwtService } from './services/jwt.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'patient-provider';
  timer: any;
  user?: any;

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private ga: GoogleAnalyticsService,
  ) {}

  async ngOnInit() {
    // printing accessToken for easier debugging.
    if (!this.jwtService.isAuthenticated()) {
      console.log('token expired.')
      this.router.navigate(['/']);
    }
    else {
      console.log('accessToken:', this.jwtService.getToken());
      this.userService.appAccessed();
      this.router.events.subscribe((val: any) => {
        if (val.urlAfterRedirects && val.urlAfterRedirects === '/public/start') {
          clearTimeout(this.timer);
        }
      })
    }
  }
}
