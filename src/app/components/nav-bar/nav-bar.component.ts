import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { JwtService } from 'src/app/services/jwt.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { UserService } from 'src/app/services/user.service';
import { ModalConfig } from 'src/app/types/pointmotion';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  hideNavbar: boolean = false;
  logoUrl = "/assets/icons/logo-white.png";

  @ViewChild('navbar') navbar!: ElementRef;
  showLogoutModal: boolean = false;
  logoutModalConfig: ModalConfig;

  username: string = '';

  constructor(
    private route:Router,
    private jwtService: JwtService,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private themeService: ThemeService,
    private userService: UserService,
    private gqlService: GraphqlService
  ) {
    this.router.events.subscribe(() => {
      this.activeTab = this.route.url.split('/').slice(-1)[0];
      if (this.route.url.split('/')[2] === 'signup') this.hideNavbar = true;
      else this.hideNavbar = false;
    });
    this.themeService.logoSubject.pipe(first()).subscribe((url) => {
      if (url) {
        this.logoUrl = url;
      } else {
        this.themeService.setTheme();
      }
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

  async ngOnInit(): Promise<void> {
    const patientId = this.userService.get().id;
    const patient = await this.gqlService.gqlRequest(
      GqlConstants.GET_PATIENT_DETAILS,
      {
        user: patientId,
      },
      true
    );
    if (!patient.patient_by_pk) return;

    this.setUserName(patient.patient_by_pk);
  }

  setUserName(user: any) {
    if (user.firstName) {
      this.username = user.firstName;

      if (user.lastName) {
        this.username += ' ' + user.lastName;
      }
    } else if (user.nickname) {
      this.username = user.nickname;
    }
  }

  setTab(tab: string) {
    this.navbar.nativeElement.classList.remove('show');
    this.activeTab = tab;
  }

  async logout() {
    this.jwtService.clearTokens();
    this.googleAnalyticsService.sendEvent('logout');
    this.router.navigate(['/']);
  }
}
