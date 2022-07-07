import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { SessionService } from "src/app/services/session/session.service";
import { Patient } from "src/app/types/pointmotion";
import { session } from "src/app/store/reducers/home.reducer";
import { trigger, transition, animate, style } from "@angular/animations";
import { GoalsService } from "src/app/services/goals/goals.service";
import { map } from "rxjs";
import { JwtService } from "src/app/services/jwt.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate(
          "{{duration}}ms ease-in",
          style({ transform: "translatex(0%)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "{{duration}}ms ease-in",
          style({ transform: "translatex(-100%)" })
        ),
      ]),
    ]),
    trigger("slideOut", [
      transition(":leave", [
        animate(
          "{{duration}}ms ease-in",
          style({ transform: "translatex(-100%)" })
        ),
      ]),
    ]),
    trigger("fadeOut", [
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: "0" })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  shScreen: boolean = false;
  user!: Patient;
  careplanId!: string;
  sessionId!: string;
  session = session.Start;
  currentSession = 0;
  dummySessions = [
    {
      title: "Sit. Stand. Achieve",
      bg: "/assets/images/start-session-bg.jpg",
      status: session.Start,
    },
    {
      title: "Mind Body Connection",
      bg: "/assets/images/mind_body_connection.jpg",
      status: session.Locked,
    },
  ];
  constructor(
    private careplanService: CareplanService,
    private sessionService: SessionService,
    private goalsService: GoalsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService
  ) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe(state => {
        this.shScreen = !!state.loggedIn;
      });

    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.shScreen = false;
    }, 4000);
  }

  nextSessionState() {
    if (this.dummySessions[this.currentSession].status === session.Completed) {
      this.currentSession++;
    } else if (
      this.dummySessions[this.currentSession].status === session.Locked
    ) {
      this.dummySessions[this.currentSession].status = session.Start;
    } else {
      this.dummySessions[this.currentSession].status++;
    }
  }

  async startNewSession() {
    if (this.jwtService.checkCareplanAndProviderInJWT()) {
      console.log('startNewSession:JWT has careplan and provider set');
      const activeCareplans = await this.careplanService.getActiveCareplans();
      if (activeCareplans.careplan.length > 0) {
        this.careplanId = activeCareplans.careplan[0].id;
        this.sessionId = (await this.sessionService.createNewSession(
          this.careplanId
          )) as string;
          this.router.navigate(["/app/session/", this.sessionId]);
        }
    } else {
      this.sessionId = (await this.sessionService.createNewSession(
        this.careplanId
      )) as string;
      this.router.navigate(["/app/session/", this.sessionId]);
    }
  }

  async loginMusic() {
    const sound = new Audio("assets/sounds/Sound Health Soundscape_LogIn.mp3");
    sound.play();
  }
}
