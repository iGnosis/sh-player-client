import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeComponent } from './pages/app/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionComponent } from './pages/app/session/session.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { StoreModule } from '@ngrx/store';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
import { GoalsComponent } from './pages/app/goals/goals.component';
import { SignupComponent } from './pages/app/signup/signup.component';
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
import { AccountDetailsComponent } from './pages/app/account-details/account-details.component';
import { BillingHistoryComponent } from './pages/app/account-details/billing-history/billing-history.component';
import { AddPaymentMethodComponent } from './pages/app/add-payment-method/add-payment-method.component';
import { NgxStripeModule } from 'ngx-stripe';
import { PrimaryModalComponent } from './components/modals/primary-modal/primary-modal.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { environment } from 'src/environments/environment';
import { SupportFabComponent } from './components/support-fab/support-fab.component';
import { GenreSelectionComponent } from './components/genre-selection/genre-selection.component';
import { FeedbackFormComponent } from './components/modals/feedback-form/feedback-form.component';
import { GeneralSettingsComponent } from './pages/app/account-details/general-settings/general-settings.component';
import { CalendarModalComponent } from './components/modals/calendar-modal/calendar-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    SessionComponent,
    SafePipe,
    GoalsComponent,
    SignupComponent,
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
    AccountDetailsComponent,
    BillingHistoryComponent,
    AddPaymentMethodComponent,
    PrimaryModalComponent,
    NotificationBarComponent,
    AvatarComponent,
    SupportFabComponent,
    GenreSelectionComponent,
    FeedbackFormComponent,
    GeneralSettingsComponent,
    CalendarModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    CarouselModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatStepperModule,
    LottieModule.forRoot({ player: playerFactory }),
    StoreModule.forRoot({}),
    NgxStripeModule.forRoot(environment.stripePublishableKey),
  ],
  providers: [
    PrivateGuard,
    PublicGuard,
    { provide: HTTP_INTERCEPTORS, useClass: UpdateHeadersInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
