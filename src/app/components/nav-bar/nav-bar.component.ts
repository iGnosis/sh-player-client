import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Service } from 'src/app/services/auth0/auth0.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  hideNavbar: boolean = false;
  constructor(
    private route:Router,
    private jwtService: JwtService,
    private userService: UserService,
    private router: Router,
    private auth0Service: Auth0Service
  ) {
    this.router.events.subscribe(() => {
      this.activeTab = this.route.url.split('/').slice(-1)[0];
      if (this.route.url.split('/')[2] === 'signup') this.hideNavbar = true;
      else this.hideNavbar = false;
    })
  }

  ngOnInit(): void {
  }

  async logout() {
    this.auth0Service.auth0Client.logout({
      returnTo: environment.auth0LogoutUrl
    });
    this.router.navigate(['/']);
  }

}
