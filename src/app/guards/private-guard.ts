import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class PrivateGuard implements CanActivateChild, CanActivate {
    constructor(private router: Router, private jwtService: JwtService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (await this.jwtService.getToken()) {
            return true
        } else {
            this.router.navigate(['/'])
            return false
        }
    }

    async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (await this.jwtService.getToken()) {
            return true
        } else {
            this.router.navigate(['/'])
            return false
        }
    }
}