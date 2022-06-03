import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { HomeComponent } from './pages/app/home/home.component';
import { PublicGuard } from './guards/public-guard';
import { PrivateGuard } from './guards/private-guard';
import { SessionComponent } from "./pages/app/session/session.component";
import { GoalsComponent } from './pages/app/goals/goals.component';
import { SignupComponent } from './pages/auth/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'public/login', pathMatch: 'full' },
  {
    path: 'public', canActivateChild: [PublicGuard], children: [
      { path: 'login', component: LoginPageComponent, },
      { path: 'signup', component: SignupComponent, },
    ]
  },
  {
    path: 'app', canActivateChild: [PrivateGuard], children: [
      { path: 'home', component: HomeComponent, },
      { path: 'goals', component: GoalsComponent, },
      { path: "session/:id", component: SessionComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
