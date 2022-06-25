import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  error = false

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const codes = await this.authService.exchangeCode(code as string);
    if (codes) {
      this.jwtService.setToken(codes.data.id_token)
      this.jwtService.setAuthTokens(codes.data)
      this.router.navigate(['app', 'home'])
    } else {
      // Show an error message
      this.error = true
      // this.router.navigate(['app', 'home'])
    }  
  }

}
