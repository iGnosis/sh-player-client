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
  carouselSlide = 1;

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

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

  async onSignIn() {
    this.errors = [];
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (data: any) => {
          this.jwtService.setToken(data.token);
          this.userService.set(data.patient);
          this.router.navigate(["/app/home"]);
          this.loginMusic();
        },
        error: (err) => {
          this.errors = err.error.message;
        },
      });
  }

  loginMusic() {
    const sound = new Audio("assets/sounds/Sound Health Soundscape_LogIn.mp3");
    sound.play();
  }
}
