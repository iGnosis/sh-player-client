import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './pages/app/home/home.component';
import { PublicGuard } from './guards/public-guard';
import { PrivateGuard } from './guards/private-guard';
import { SessionComponent } from "./pages/app/session/session.component";
import { GoalsComponent } from './pages/app/goals/goals.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { HelpComponent } from './pages/app/help/help.component';
import { PrivateComponent } from './layouts/private/private.component';
import { StartComponent } from './pages/auth/start/start.component';
import { RewardsComponent } from './pages/app/rewards/rewards.component';
import { DailyCheckinComponent } from './components/daily-checkin/daily-checkin.component';
import { SmsOtpLoginComponent } from './pages/auth/sms-otp-login/sms-otp-login.component';
import { environment } from 'src/environments/environment';
import { AccountDetailsComponent } from './pages/app/account-details/account-details.component';
import { BillingHistoryComponent } from './pages/app/billing-history/billing-history.component';
import { AddPaymentMethodComponent } from './pages/app/add-payment-method/add-payment-method.component';

const routes: Routes = [
  {
    path: 'therapist',
    component: StartComponent,
    resolve: {
      url: 'externalUrlRedirectResolver'
    },
    data: {
      externalUrl: environment.providerEndpoint
    }
  },
  { path: '', redirectTo: 'public/start', pathMatch: 'full' },
  {
    path: 'public', canActivateChild: [PublicGuard], children: [
      { path: 'start', component: StartComponent },
      { path: 'login', component: SmsOtpLoginComponent }
    ]
  },
  { path: "app/session", component: SessionComponent, canActivate: [PrivateGuard] },
  {
    path: 'app', component: PrivateComponent, canActivateChild: [PrivateGuard], children: [
      { path: 'signup', component: SignupComponent, },
      { path: 'signup/:step', component: SignupComponent, },
      { path: 'signup/:step/:interest', component: SignupComponent, },
      { path: 'checkin', component: DailyCheckinComponent, },
      { path: 'home', component: HomeComponent, },
      { path: 'rewards', component: RewardsComponent },
      { path: 'goals', component: GoalsComponent, },
      { path: 'help', component: HelpComponent, },
      { path: 'account-details', component: AccountDetailsComponent, },
      { path: 'billing-history', component: BillingHistoryComponent, },
      { path: 'add-payment-method', component: AddPaymentMethodComponent, },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        window.location.href = (route.data as any).externalUrl;
      }
    }
  ]
})
export class AppRoutingModule {}
