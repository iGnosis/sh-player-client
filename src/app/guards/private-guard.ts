import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate, UrlTree } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class PrivateGuard implements CanActivateChild, CanActivate {
  constructor(private router: Router, private jwtService: JwtService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jwtService.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jwtService.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}