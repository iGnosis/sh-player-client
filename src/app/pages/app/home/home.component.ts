import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { SessionService } from "src/app/services/session/session.service";
import { Patient } from "src/app/types/patient";
import { session } from "src/app/store/reducers/home.reducer";
import { trigger, transition, animate, style } from "@angular/animations";
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
  ],
})
export class HomeComponent implements OnInit {
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
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit(): void {}

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
    const activeCareplans = await this.careplanService.getActiveCareplans();
    if (activeCareplans.careplan.length > 0) {
      this.careplanId = activeCareplans.careplan[0].id;
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
