import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Service } from './services/auth0/auth0.service';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'patient-provider';
  timer: any;
  user?: any;

  constructor(
    private router: Router,
    private jwtService: JwtService
  ) {}

  async ngOnInit() {
    // printing accessToken for easier debugging.
    console.log('accessToken:', await this.jwtService.getToken())

    this.router.events.subscribe((val: any) => {
      if(val.urlAfterRedirects && val.urlAfterRedirects === '/public/start') {
        clearTimeout(this.timer);
      }
    })
  }
}
