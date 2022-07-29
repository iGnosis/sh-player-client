import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShScreenComponent } from "src/app/components/sh-screen/sh-screen.component";
import { AuthService } from "src/app/services/auth.service";
import { Auth0Service } from "src/app/services/auth0/auth0.service";
import { DailyCheckinService } from "src/app/services/daily-checkin/daily-checkin.service";
import { JwtService } from "src/app/services/jwt.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-callback",
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.scss"],
})
export class CallbackComponent implements OnInit {
  shScreen = false;
  isMusicEnded = false;

  error = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
    private dailyCheckinService: DailyCheckinService,
    private router: Router,
    private auth0Service: Auth0Service
  ) {
    console.log('callback component:init')
  }

  async ngOnInit() {
    await this.auth0Service.auth0Client.handleRedirectCallback();

    const user = await this.auth0Service.auth0Client.getUser({
      scope: environment.auth0Scope,
      audience: environment.auth0Audience
    })

    console.log('CallbackComponent:user:', user);

    const accessToken = await this.auth0Service.auth0Client.getTokenSilently()
    console.log('accessToken:', accessToken);

    // fetches access_token & sends it to the token observers.
    await this.jwtService.getToken();

    if (!accessToken) {
      // Show an error message
      this.error = true;
      // this.router.navigate(['app', 'home'])
      return;
    }

    const accessTokenData = this.decodeJWT(accessToken);
    console.log('accessTokenData:', accessTokenData);

    const userId = accessTokenData["https://hasura.io/jwt/claims"]["x-hasura-user-id"];
    const userEmail = accessTokenData["https://hasura.io/jwt/claims"]["x-hasura-user-email"];

    this.userService.set({
      email: userEmail,
      id: userId,
    });
    console.log('user set successfully')

    const step = await this.userService.isOnboarded();
    if (step == -1) {
      this.shScreen = true;
      await this.waitForTimeout(6500);

      if (await this.isCheckedInToday()) {
        this.router.navigate(["app", "home"]);
      } else {
        this.router.navigate(["app", "checkin"]);
      }
    } else {
      this.shScreen = true;
      await this.waitForTimeout(6500);
      this.router.navigate(["app", "signup", step]);
    }
  }

  async waitForTimeout(timeout: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, timeout);
    });
  }

  async isCheckedInToday() {
    const res = await this.dailyCheckinService.getLastCheckin();
    if (!res.checkin[0]) return false;
    const checkedInAt = new Date(res.checkin[0].createdAt);
    const today = new Date();
    return checkedInAt.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0);
  }

  decodeJWT(token: string | undefined) {
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        return JSON.parse(atob(parts[1]));
      }
    }
  }
}
