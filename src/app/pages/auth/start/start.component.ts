import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  carouselSlide: number = 1;
  signUpLink = ''
  loginLink = ''

  constructor(private authService: AuthService,) { 
    this.signUpLink = this.authService.getSignupLink();
    this.loginLink = this.authService.getLoginLink();
  }

  ngOnInit(): void {
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }

}
