import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  carouselSlide: number = 1;
  signUpLink = ''
  loginLink = ''

  constructor(private router: Router) { }

  ngOnInit(): void { }

  async signUp() {
    this.router.navigate(['public/login'])
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }
}
