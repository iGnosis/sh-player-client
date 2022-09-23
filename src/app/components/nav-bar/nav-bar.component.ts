import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { JwtService } from 'src/app/services/jwt.service';

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
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.router.events.subscribe(() => {
      this.activeTab = this.route.url.split('/').slice(-1)[0];
      if (this.route.url.split('/')[2] === 'signup') this.hideNavbar = true;
      else this.hideNavbar = false;
    })
  }

  ngOnInit(): void { }

  async logout() {
    this.jwtService.clearTokens();
    this.googleAnalyticsService.sendEvent('logout');
    this.router.navigate(['/']);
  }
}
