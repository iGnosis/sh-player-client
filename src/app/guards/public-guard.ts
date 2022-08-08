import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Auth0Service } from '../services/auth0/auth0.service';

@Injectable()
export class PublicGuard implements CanActivateChild {
  constructor(private router: Router, private auth0Service: Auth0Service) { }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.auth0Service.auth0Client.isAuthenticated()) {
      this.router.navigate(['/app/home'])
      return false
    } else {
      return true
    }
  }
}