import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { JwtService } from "src/app/services/jwt.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  errors: string[] = [];
  email = "";
  password = "";
  showPassword = false;
  signUpLink = ''
  loginLink = ''

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.signUpLink = this.authService.getSignupLink();
    this.loginLink = this.authService.getLoginLink();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {
    this.errors = [];
    location.href = this.loginLink;

    // await this.authService
    //   .login({ email: this.email, password: this.password })
    //   .subscribe({
    //     next: (data: any) => {
    //       this.jwtService.setToken(data.token);
    //       this.userService.set(data.patient);
    //       this.router.navigate(["/app/home"], { state: { loggedIn: true }});
    //       location.href = this.loginLink;
    //       this.loginMusic();
    //     },
    //     error: (err) => {
    //       console.error(err)
    //       if (err.err) {
    //         this.errors = err.error.message;
    //       }
    //     },
    //   });
  }

  loginMusic() {
    const sound = new Audio("assets/sounds/Sound Health Soundscape_LogIn.mp3");
    sound.play();
  }
}
