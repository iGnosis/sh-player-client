import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { UserService } from 'src/app/services/user.service';
import { ErpNextEventTypes, Patient } from 'src/app/types/pointmotion';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {
  carouselSlide: number = 1;
  signUpLink = ''
  loginLink = ''
  routeSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private titleService: Title,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    const erpNextActionType = this.route.snapshot.queryParamMap.get("actionType") as ErpNextEventTypes;
    this.userService.erpNextEvent(erpNextActionType);

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      let patientDetails: Partial<Patient> = {
        phoneNumber: '',
        phoneCountryCode: '',
        salutation: '',
        firstName: '',
        lastName: '',
        email: '',
      };

      for (const key of Object.keys(patientDetails)) {
        patientDetails[key as keyof typeof patientDetails] = params[key];
      }

      sessionStorage.setItem('patient', JSON.stringify(patientDetails));
    });
  }

  ngOnInit(): void {
    const refParam = this.route.snapshot.queryParamMap.get('ref');
    const title = this.titleService.getTitle();

    if (refParam) {
      this.googleAnalyticsService.sendEvent('page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: title,
        page_referrer: refParam,
      })
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async signUp() {
    this.router.navigate(['public/login'])
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }
}
