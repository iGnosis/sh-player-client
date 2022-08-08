import { Component, OnInit } from "@angular/core";

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

  constructor() { }

  ngOnInit(): void { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {
    this.errors = [];

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
