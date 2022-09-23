import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class PublicGuard implements CanActivateChild {
  constructor(private router: Router, private jwtService: JwtService) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jwtService.isAuthenticated()) {
      this.router.navigate(['/app/home'])
      return false
    } else {
      return true
    }
  }
}