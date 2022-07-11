import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { HomeComponent } from './pages/app/home/home.component';
import { PublicGuard } from './guards/public-guard';
import { PrivateGuard } from './guards/private-guard';
import { SessionComponent } from "./pages/app/session/session.component";
import { GoalsComponent } from './pages/app/goals/goals.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { HelpComponent } from './pages/app/help/help.component';
import { PrivateComponent } from './layouts/private/private.component';
import { CallbackComponent } from './pages/auth/callback/callback.component';
import { StartComponent } from './pages/auth/start/start.component';
import { RewardsComponent } from './pages/app/rewards/rewards.component';
import { MoodCheckinComponent } from './components/mood-checkin/mood-checkin/mood-checkin.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/start', pathMatch: 'full' },
  {
    path: 'public', canActivateChild: [PublicGuard], children: [
      { path: 'start', component: StartComponent },
      { path: 'login', component: LoginPageComponent, },
    ]
  },
  { path: 'oauth/callback', component: CallbackComponent},
  { path: "app/session/:id", component: SessionComponent, canActivate: [PrivateGuard] },
  {
    path: 'app', component: PrivateComponent, canActivateChild: [PrivateGuard], children: [
      { path: 'signup', component: SignupComponent, },
      { path: 'signup/:step', component: SignupComponent, },
      { path: 'signup/:step/:interest', component: SignupComponent, },
      { path: 'mood', component: MoodCheckinComponent, },
      { path: 'home', component: HomeComponent, },
      { path: 'rewards', component: RewardsComponent },
      { path: 'goals', component: GoalsComponent, },
      { path: 'help', component: HelpComponent, },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
