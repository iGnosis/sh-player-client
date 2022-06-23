import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  constructor(
    private route:Router,
    private jwtService: JwtService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeTab = this.route.url.split('/').slice(-1)[0];    
  }

  logout() {
    this.jwtService.setToken('');
    this.userService.setPatient();
    this.userService.set();
    this.router.navigate(['/public/login']);
  }

}
