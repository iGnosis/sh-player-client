import { Component } from '@angular/core';
import { phone } from 'phone';
import countryCodes from 'country-codes-list'
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { JwtService } from 'src/app/services/jwt.service';

// TODO: Decouple this Component (checkins, onboardings... etc)
@Component({
  selector: 'app-sms-otp-login',
  templateUrl: './sms-otp-login.component.html',
  styleUrls: ['./sms-otp-login.component.scss']
})
export class SmsOtpLoginComponent {
  shScreen = false;
  step = 0;
  selectedCountry = '+1 USA'; // set default to USA
  countryCode = '+1';  // set default to USA
  phoneNumber?: string;
  fullPhoneNumber?: string;
  otpCode?: string;
  formErrorMsg?: string;
  countryCodesList?: { [key: number]: string };

  constructor(
    private graphQlService: GraphqlService,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService,
    private dailyCheckinService: DailyCheckinService
  ) {
    this.countryCodesList = countryCodes.customList('countryCallingCode', '+{countryCallingCode} {countryNameEn}');
    console.log('myCountryCodesObject:', this.countryCodesList);

    // fetch user's country.
    this.userService.fetchCountry().subscribe(res => {
      this.userService.fetchCountryPhone(res.country) // remove the last character '\n'
        .then(fetchCountryPhoneResp => {
          this.countryCode = `+${fetchCountryPhoneResp.phone}`
          this.selectedCountry = `${this.countryCode} ${fetchCountryPhoneResp.name}`
        })
    })
  }

  ngOnInit(): void { }

  async submit(event: any) {
    // call API to send an OTP
    if (this.step === 0) {
      console.log('submit:countryCode:', event.target.countryCode.value);
      console.log('submit:phoneNumber:', event.target.phoneNumber.value);
      this.countryCode = event.target.countryCode.value;
      this.phoneNumber = event.target.phoneNumber.value;

      let phoneObj = phone(`${this.countryCode}${this.phoneNumber}`);
      console.log(phoneObj);

      if (!phoneObj.isValid) {
        this.formErrorMsg = 'Phone number is not valid';
        this.resetErrorMsg();
        return;
      }

      // call API to send OTP
      const resp = await this.graphQlService.gqlRequest(GqlConstants.REQUEST_LOGIN_OTP, {
        phoneCountryCode: this.countryCode,
        phoneNumber: this.phoneNumber
      }, false)

      if (!resp || !resp.requestLoginOtp || !resp.requestLoginOtp.data.message) {
        this.formErrorMsg = 'Something went wrong while sending OTP.';
        this.resetErrorMsg();
        return;
      }

      // increment step
      this.formErrorMsg = '';
      this.step++;
    }

    // call API to validate the code
    else if (this.step === 1) {

      console.log('submit:otpCode:', event.target.otpCode.value);
      this.otpCode = event.target.otpCode.value;

      // you should get back JWT in success response.
      const resp = await this.graphQlService.gqlRequest(GqlConstants.VERIFY_LOGIN_OTP, {
        phoneCountryCode: this.countryCode,
        phoneNumber: this.phoneNumber,
        otp: parseInt(this.otpCode!)
      }, false)

      if (!resp || !resp.verifyLoginOtp || !resp.verifyLoginOtp.data.token) {
        this.formErrorMsg = 'That is not the code.'
        this.resetErrorMsg();
        return;
      }

      // set user as well
      this.jwtService.setToken(resp.verifyLoginOtp.data.token);

      const accessTokenData = this.decodeJwt(resp.verifyLoginOtp.data.token);
      const userId = accessTokenData["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
      this.userService.set({
        id: userId,
      });
      console.log('user set successfully')

      this.shScreen = true;
      await this.waitForTimeout(6500);
      const isCheckedInToday = await this.isCheckedInToday();
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
        return;
      }

      const step = await this.userService.isOnboarded();
      if (step == -1) {
        this.router.navigate(["app", "home"]);
      } else {
        this.router.navigate(["app", "signup", step]);
      }
    }
  }

  resetForm() {
    this.step = 0;
    this.countryCode = '';
    this.phoneNumber = '';
    this.fullPhoneNumber = '';
    this.otpCode = '';
    this.formErrorMsg = '';
  }

  resetErrorMsg(timeout?: number) {
    setTimeout(() => {
      this.formErrorMsg = '';
    }, timeout || 5000);
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, timeout);
    });
  }

  async isCheckedInToday() {
    const res = await this.dailyCheckinService.getLastCheckin();
    if (!res.checkin[0]) return false;
    const checkedInAt = new Date(res.checkin[0].createdAt);
    const today = new Date();
    return checkedInAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0);
  }

  decodeJwt(token: string | undefined) {
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        return JSON.parse(atob(parts[1]));
      }
    }
  }
}
