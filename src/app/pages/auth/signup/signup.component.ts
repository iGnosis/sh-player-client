import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errors = [];
  email: string = "";
  password: string = "";
  username: string = "";
  showPassword: boolean = false;
  carouselSlide: number = 1;
  signupStep: number = 0;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      if (this.carouselSlide === 3) this.carouselSlide = 1;
      else this.carouselSlide++;
    }, 4000);
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }

  nextStep() {
    this.signupStep++;
  }

}
