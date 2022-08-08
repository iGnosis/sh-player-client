import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate, UrlTree } from '@angular/router';
import { Auth0Service } from '../services/auth0/auth0.service';

@Injectable()
export class PrivateGuard implements CanActivateChild, CanActivate {
  constructor(private router: Router, private auth0Service: Auth0Service) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.auth0Service.auth0Client.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.auth0Service.auth0Client.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}