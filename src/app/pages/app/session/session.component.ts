import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtService } from "src/app/services/jwt.service";
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
  ) {
    this.sessionId = this.route.snapshot.paramMap.get("id") as string;
    console.log(this.sessionId);
    this.url = environment.activityEndpoint + "?session=" + this.sessionId;
  }

  ngOnInit(): void {
    window.addEventListener("message", async (event) => {
      if (event && event.data && event.data.type) {
        if (event.data.type === 'activity-experience-ready') {
          this.session.nativeElement.contentWindow?.postMessage(
            {
              type: 'token',
              token: this.jwtService.getToken(),
              session: this.sessionId,
              benchmarkId: this.route.snapshot.queryParamMap.get('benchmarkId'),
            },
            "*"
          );
        }
        // sends a latest valid access_token.
        else if (event.data.type === 'end-game') {
          this.router.navigate(['/app/home'])
        }
      }

      if(event && event.data && event.data.session && event.data.session.id) {
        this.router.navigate(['/app/home'])
      }
      if(event && event.data && event.data.type === 'check-auth' && !event.data.token) {
        this.jwtService.clearTokens();
      }
    }, false);
  }
}
