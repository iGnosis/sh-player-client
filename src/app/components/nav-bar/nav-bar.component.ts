import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { JwtService } from 'src/app/services/jwt.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ModalConfig } from 'src/app/types/pointmotion';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  hideNavbar: boolean = false;
  logoUrl = "/assets/icons/sound_health_logo_alpha.png";
  showLogoutModal: boolean = false;
  logoutModalConfig: ModalConfig;

  constructor(
    private route:Router,
    private jwtService: JwtService,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private themeService: ThemeService
  ) {
    this.router.events.subscribe(() => {
      this.activeTab = this.route.url.split('/').slice(-1)[0];
      if (this.route.url.split('/')[2] === 'signup') this.hideNavbar = true;
      else this.hideNavbar = false;
    });
    const logoSubscription = this.themeService.logoSubject.subscribe((url) => {
      this.logoUrl = url;
      if (url) logoSubscription.unsubscribe();
    });

    this.logoutModalConfig = {
      title: 'Sign Out from Sound Health',
      body: 'Are you sure you want to stop your progress and leave the Sound Health platform?',
      closeButtonLabel: 'Sign Out',
      submitButtonLabel: 'Cancel',
      onClose: () => {
        this.logout();
      },
      onSubmit: () => {
        this.showLogoutModal = false;
      },
    };
  }

  ngOnInit(): void { }

  async logout() {
    this.jwtService.clearTokens();
    this.googleAnalyticsService.sendEvent('logout');
    this.router.navigate(['/']);
  }
}
