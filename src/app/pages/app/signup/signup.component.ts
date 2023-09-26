import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  steps = ['setup', 'profile', 'email', 'payment', 'finish'];
  stepperSteps = this.steps.slice(1, this.steps.length - 1);
  stepperIndex: number = 0;
  incompleteStep: number = 0;

  profileForm: FormGroup;
  emailForm: FormGroup;

  subscriptionFee: number = 30;
  trialPeriod: number = 30;

  error: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dailyCheckinService: DailyCheckinService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.route.params.subscribe(params => {
      this.error = '';
      const step = params['step'];
      if (step && this.steps.indexOf(step) > -1) {
        this.stepperIndex = this.steps.indexOf(step);
      } else {
        this.router.navigate(['/app/signup', this.steps[0]]);
      }
    });

    this.profileForm = this._formBuilder.group({
      salutation: ['Mr'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.emailForm = this._formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getIncompleteSteps();
    await this.getSubscriptionDetails();
  }

  ngAfterContentInit(): void {
    const patientDetails = JSON.parse(sessionStorage.getItem('patient') || '{}');

    for (const key in this.profileForm.controls) {
      if (patientDetails[key] && patientDetails[key].trim() !== '') {
        this.profileForm.get(key)?.setValue(patientDetails[key]);
      }
    }

    if (patientDetails['email'] && patientDetails['email'].trim() !== '') {
      this.emailForm.get('email')?.setValue(patientDetails['email']);
    }
  }

  async getIncompleteSteps() {
    const step = await this.userService.isOnboarded();
    this.incompleteStep = this.steps.indexOf(step);
  }

  async nextIncompleteStep() {
    this.router.navigate(['/app/signup', this.steps[this.incompleteStep]]);
  }

  async getSubscriptionDetails() {
    const res = await this.authService.getSubscriptionPlanDetails();
    if (res) {
      this.subscriptionFee = res.subscriptionFee;
      this.trialPeriod = res.trialPeriod;
      if (!res.requirePaymentDetails) {
        this.steps = this.steps.filter(step => step !== 'payment');
        this.stepperSteps = this.steps.slice(1, this.steps.length - 1);
      }
    }
  }

  goBack() {
    this.stepperIndex--;
    this.router.navigate(['/app/signup', this.steps[this.stepperIndex]]);
  }

  nextStep(){
    this.stepperIndex++;
    this.router.navigate(['/app/signup', this.steps[this.stepperIndex]]);
  }

  async submitForm(step: 'profile' | 'email') {
    if (step === 'profile') {
      await this.saveProfile();
    } else if (step === 'email') {
      await this.saveEmail();
    }
  }

  async saveProfile() {
    const res = await this.authService.setPatientProfile({
      namePrefix: this.profileForm.value.salutation,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
    });
    if(res.response && res.response.errors) {
      this.error = res.response.errors[0].message;
    } else {
      this.nextStep();
    }
  }

  async saveEmail() {
    const res = await this.authService.setPatientEmail(this.emailForm.value.email);
    if(res.response && res.response.errors) {
      this.error =
        res.response.errors.map((err: any) => {
        if(err.message.includes('Uniqueness violation')) {
          return 'This email is already registered'
        } else {
          return err.message;
        }
      })[0];
    } else {
      this.nextStep();
    }
  }

  async finishSignup() {
    try {
      await this.authService.createStripeCustomer();
    } catch (err: any) {
      this.error = err.message;
      return;
    }
    this.googleAnalyticsService.sendEvent('sign_up');
    const isCheckedInToday = await this.dailyCheckinService.isCheckedInToday();
    if (!isCheckedInToday) {
      this.router.navigate(["app", "checkin"]);
      return;
    }
    this.router.navigate(["/app/home"]);
  }

  addPaymentMethod() {
    if (environment.stripePublishableKey) {
      this.router.navigate(['/app/add-payment-method', { signup: true }]);
    } else {
      this.router.navigate(['/app/home']);
    }
  }
}
