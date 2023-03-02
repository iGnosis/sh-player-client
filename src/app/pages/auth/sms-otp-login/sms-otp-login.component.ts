import {Component} from '@angular/core';
import {phone} from 'phone';
import {GraphqlService} from 'src/app/services/graphql/graphql.service';
import {GqlConstants} from "src/app/services/gql-constants/gql-constants.constants";
import {Router} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {DailyCheckinService} from 'src/app/services/daily-checkin/daily-checkin.service';
import {JwtService} from 'src/app/services/jwt.service';
import {GoogleAnalyticsService} from 'src/app/services/google-analytics/google-analytics.service';

// TODO: Decouple this Component (checkins, onboardings... etc)
@Component({
  selector: 'app-sms-otp-login',
  templateUrl: './sms-otp-login.component.html',
  styleUrls: ['./sms-otp-login.component.scss']
})
export class SmsOtpLoginComponent {
  shScreen = false;
  isMusicEnded = false;
  step = 0;
  selectedCountry = '+1 USA'; // set default to USA
  countryCode = '+1';  // set default to USA
  phoneNumber?: string;
  otpCode?: string;
  isEmailRegistered?: boolean;
  showResendOtpTimerText = false;
  resendOtpTimer = 59;
  formErrorMsg?: string;

  // required to figure out which OTP API to call.
  // The Resend OTP API is called if numbers haven't changed.
  tempFullPhoneNumber?: string;
  fullPhoneNumber?: string;

  throttledSubmit: (...args: any[]) => void;
  throttledResend: (...args: any[]) => void;

  constructor(
    private graphQlService: GraphqlService,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService,
    private dailyCheckinService: DailyCheckinService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.throttledSubmit = this.throttle((event: any) => {
      this.submit(event);
    }, 500);
    this.throttledResend = this.throttle(() => {
      this.resendOTP();
    }, 1000);
  }

  throttle(fn: any, wait = 500) {
    let isCalled = false;
    return function (...args: any[]) {
      if (!isCalled) {
        fn(...args);
        isCalled = true;
        setTimeout(function () {
          isCalled = false;
        }, wait);
      }
    };
  }

  ngOnInit(): void { }

  ngAfterContentInit() {
    const patientDetails = JSON.parse(sessionStorage.getItem('patient') || '{}');
    this.countryCode = patientDetails.phoneCountryCode ? '+' + patientDetails.phoneCountryCode.trim() : this.countryCode;
    this.phoneNumber = patientDetails.phoneNumber ? patientDetails.phoneNumber : this.phoneNumber;
  }

  async submit(event: any) {

    // call API to send an OTP
    if (this.step === 0) {
      this.countryCode = event.target.countryCode.value;
      if (this.countryCode.slice(0, 1) !== '+') {
        this.countryCode = `+${this.countryCode}`;
      }
      this.phoneNumber = event.target.phoneNumber.value;

      this.countryCode = this.countryCode ? this.countryCode.trim() : '';
      this.phoneNumber = this.phoneNumber ? this.phoneNumber.trim() : '';

      let phoneObj = phone(`${this.countryCode}${this.phoneNumber}`);

      if (!phoneObj.isValid) {
        this.showError('Phone number is not valid');
        return;
      }

      this.fullPhoneNumber = phoneObj.phoneNumber;

      // call the Resend OTP API, since phone number did not change.
      if (this.tempFullPhoneNumber === this.fullPhoneNumber) {
        console.log('resend OTP API called');
        const resp = await this.graphQlService.gqlRequest(GqlConstants.RESEND_LOGIN_OTP, {
          phoneCountryCode: this.countryCode,
          phoneNumber: this.phoneNumber
        }, false);
        if (!resp || !resp.resendLoginOtp || !resp.resendLoginOtp.data.message) {
          this.showError('Something went wrong while sending OTP.');
          return;
        }
        if (resp.resendLoginOtp.data.isExistingUser) {
          this.isEmailRegistered = true;
        }
      }
      // call Request Login OTP API, since the phone number changed.
      else {
        const resp = await this.graphQlService.gqlRequest(GqlConstants.REQUEST_LOGIN_OTP, {
          phoneCountryCode: this.countryCode,
          phoneNumber: this.phoneNumber
        }, false);
        if (!resp || !resp.requestLoginOtp || !resp.requestLoginOtp.data.message) {
          if (resp.message && resp.message.toLowerCase().includes('unauthorized')) {
            this.showError('Account does not exist. Please ask your provider to create an account for you.');
          } else {
            this.showError('Something went wrong while sending OTP.');
          }
          return;
        }
        if (resp.requestLoginOtp.data.isExistingUser) {
          this.isEmailRegistered = true;
        }
      }

      // increment step
      this.formErrorMsg = '';
      this.step++;
      this.showResendOtpTimerText = true;
      this.resendOtpTimer = 60;
      const timerInt = setInterval(() => {
        this.resendOtpTimer--;
        if (this.resendOtpTimer === 0) {
          clearInterval(timerInt);
          this.showResendOtpTimerText = false;
        }
      }, 1000);

      if (this.step > 1) {
        this.step = 1;
      }
    }

    // call API to validate the code
    else if (this.step === 1) {
      this.otpCode = event.target.otpCode.value;

      // you should get back JWT in success response.
      const resp = await this.graphQlService.gqlRequest(GqlConstants.VERIFY_LOGIN_OTP, {
        phoneCountryCode: this.countryCode,
        phoneNumber: this.phoneNumber,
        otp: parseInt(this.otpCode!)
      }, false);

      if (!resp || !resp.verifyLoginOtp || !resp.verifyLoginOtp.data.token) {
        this.showError('That is not the code.');
        return;
      }

      // set user as well
      this.jwtService.setToken(resp.verifyLoginOtp.data.token);

      const accessTokenData = this.jwtService.decodeJwt(resp.verifyLoginOtp.data.token);
      let userId;
      if (accessTokenData && accessTokenData["https://hasura.io/jwt/claims"]) {
        userId = accessTokenData["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      }
      this.userService.set({
        id: userId,
      });
      this.googleAnalyticsService.setUserId(userId);
      console.log('user set successfully');
      // emit signup event
      this.googleAnalyticsService.sendEvent('login');
      const patientId = this.userService.get().id;

      const userResp = await this.graphQlService.gqlRequest(GqlConstants.GET_PATIENT_DETAILS, {
        user: patientId,
      }, true);
      if (userResp && userResp.patient_by_pk) {
        if (!userResp.patient_by_pk.customerId) {
          const createCustomerResp = await this.graphQlService.gqlRequest(GqlConstants.CREATE_CUSTOMER, {}, true);
        }
      }

      this.shScreen = true;
      await this.waitForTimeout(6500);

      const onBoardedStep = await this.userService.isOnboarded();
      if (onBoardedStep !== 'finish') {
        this.router.navigate(["app", "signup", "setup"]);
        return;
      }

      const isCheckedInToday = await this.dailyCheckinService.isCheckedInToday();
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
        return;
      }
      
      this.router.navigate(["app", "home"]);
    }
  }

  goBack() {
    this.router.navigate(["/public/start"]);
  }

  resetForm() {
    this.tempFullPhoneNumber = this.fullPhoneNumber;
    this.step = 0;
    this.phoneNumber = '';
    this.fullPhoneNumber = '';
    this.otpCode = '';
    this.formErrorMsg = '';
    this.isEmailRegistered = false;
  }

  showError(message: string, timeout: number = 5000) {
    this.formErrorMsg = message;
    setTimeout(() => {
      this.formErrorMsg = '';
    }, timeout);
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, timeout);
    });
  }

  async resendOTP() {
    const resp = await this.graphQlService.gqlRequest(GqlConstants.RESEND_LOGIN_OTP, {
      phoneCountryCode: this.countryCode,
      phoneNumber: this.phoneNumber
    }, false);
    this.showResendOtpTimerText = true;
    this.resendOtpTimer = 60;
    const timerInt = setInterval(() => {
      this.resendOtpTimer--;
      if (this.resendOtpTimer === 0) {
        clearInterval(timerInt);
        this.showResendOtpTimerText = false;
      }
    }, 1000);
  }
}
