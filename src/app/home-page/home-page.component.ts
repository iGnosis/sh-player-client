import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    items: 1,
    navSpeed: 700,
    dots:false,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
  ],
    responsive: {
      0: {
        items: 3,
        margin:10,
      },
      400: {
        items: 3
      },
      740: {
        items: 3
      },
      940: {
        items: 5,
        margin:10
      }
    },
    nav: true
  }
  constructor() { }

  ngOnInit(): void {

  }

}
