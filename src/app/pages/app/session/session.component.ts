import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { JwtService } from "src/app/services/jwt.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit {
  url = "";
  sessionId = "";
  @ViewChild("session") session!: ElementRef<HTMLIFrameElement>;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.sessionId = this.route.snapshot.paramMap.get("id") as string;
    console.log(this.sessionId);
    this.url = environment.activityEndpoint + "?session=" + this.sessionId;
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   // TODO: Bad security practice, need a better way to do it...
    //   this.session.nativeElement.contentWindow?.postMessage(
    //     {
    //       token: window.localStorage.getItem("token"),
    //       session: this.sessionId,
    //     },
    //     "*"
    //   );
    // }, 1000);

    window.addEventListener("message", async (event) => {
      
      if(event && event.data && event.data.type ) {
        console.log(event);
        if (event.data.type === 'activity-experience-ready') {
          this.session.nativeElement.contentWindow?.postMessage(
            {
              type: 'token',
              token: window.localStorage.getItem("token"),
              session: this.sessionId,
            },
            "*"
          );
        }
      }
      
      if(event && event.data && event.data.session && event.data.session.id) {
        this.router.navigate(['/app/home'])
      }
      if(event && event.data && event.data.type === 'check-auth' && !event.data.token) {
        const tokens = this.jwtService.getAuthTokens();
        if (tokens && tokens.refresh_token) {
          await this.authService.logout({ refreshToken: tokens.refresh_token });
        };
        this.jwtService.clearAuthTokens();
        this.userService.setPatient();
        this.userService.set();
        window.location.href = this.authService.getLoginLink();
      }
    }, false);
  }
}
