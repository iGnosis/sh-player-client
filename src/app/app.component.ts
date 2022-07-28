import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from './services/auth.service';
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
  ) {}

  async ngOnInit() {
    this.router.events.subscribe((val: any) => {
      if(val.urlAfterRedirects && val.urlAfterRedirects === '/public/start') {
        clearTimeout(this.timer);
      }
    })
  }
}
