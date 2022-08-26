import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { HomeComponent } from './pages/app/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SessionComponent } from './pages/app/session/session.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { StoreModule } from '@ngrx/store';
import { homeReducer } from './store/reducers/home.reducer';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { GoalsComponent } from './pages/app/goals/goals.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { HelpComponent } from './pages/app/help/help.component';
import { UpdateHeadersInterceptor } from './interceptors/update-headers.interceptor';
import { PrivateComponent } from './layouts/private/private.component';
import { StartComponent } from './pages/auth/start/start.component';
import { RewardsComponent } from './pages/app/rewards/rewards.component';
import { LottieModule } from 'ngx-lottie';

export function playerFactory(): any {
  return import('lottie-web');
}

import { ShScreenComponent } from './components/sh-screen/sh-screen.component';
import { FeedbackModalComponent } from './components/modals/feedback-modal/feedback-modal/feedback-modal.component';
import { DailyCheckinComponent } from './components/daily-checkin/daily-checkin.component';
import { ShareRewardModalComponent } from './components/share-reward-modal/share-reward-modal.component';
import { SmsOtpLoginComponent } from './pages/auth/sms-otp-login/sms-otp-login.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    HomeComponent,
    NavBarComponent,
    SessionComponent,
    SafePipe,
    GoalsComponent,
    SignupComponent,
    HelpComponent,
    PrivateComponent,
    StartComponent,
    RewardsComponent,
    ShScreenComponent,
    FeedbackModalComponent,
    DailyCheckinComponent,
    ShareRewardModalComponent,
    SmsOtpLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    CarouselModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LottieModule.forRoot({ player: playerFactory }),
    StoreModule.forRoot({
      home: homeReducer
    })
  ],
  providers: [
    PrivateGuard,
    PublicGuard,
    { provide: HTTP_INTERCEPTORS, useClass: UpdateHeadersInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
