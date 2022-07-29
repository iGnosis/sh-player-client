import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Auth0Service } from 'src/app/services/auth0/auth0.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  carouselSlide: number = 1;
  signUpLink = ''
  loginLink = ''

  constructor(private auth0Service: Auth0Service) { }

  ngOnInit(): void {
  }

  async signUp() {
    await this.auth0Service.auth0Client.loginWithRedirect({
      redirect_uri: environment.auth0CbUrl,
      screen_hint: 'signup'
    });
  }

  async login() {
    await this.auth0Service.auth0Client.loginWithRedirect({
      redirect_uri: environment.auth0CbUrl,
      screen_hint: 'login'
    });
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }
}
