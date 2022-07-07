import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { SessionService } from "src/app/services/session/session.service";
import { Patient } from "src/app/types/pointmotion";
import { session } from "src/app/store/reducers/home.reducer";
import { trigger, transition, animate, style } from "@angular/animations";
import { GoalsService } from "src/app/services/goals/goals.service";
import { map } from "rxjs";
import * as d3 from "d3";
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
      transition(":leave", [animate("200ms ease-in", style({ opacity: "0" }))]),
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

  monthlyCompletionPercent: number = 70;
  monthlyGoalPercent: number = 100;
  monthRange = d3.range(0, 30.5, 5);

  // TODO: has to be changed based on monthly goals API
  rewardsRange = [5, 10, 15];
  daysCompletedThisMonth = 22;

  // TODO: has to be changed based on daily goals API
  minutesCompletedToday = 15;

  currentDate = {
    day: `${new Date().getDate()}${this.nth(new Date().getDate())}`,
    month: new Date().toLocaleDateString("default", { month: "long" }),
    year: new Date().getFullYear(),
  };

  dailyCompletitionPercent!: number;

  dummySessions = [
    {
      title: "Sit. Stand. Achieve",
      bg: "/assets/images/start-session-bg.jpg",
      status: session.Start,
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
    console.log(this.monthRange);
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((state) => {
        this.shScreen = !!state.loggedIn;
      });

    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
  }

  ngAfterViewInit(): void {
    this.initMonthlyBar();
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
      console.log("startNewSession:JWT has careplan and provider set");
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

  nth(d: number) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  initMonthlyBar() {
    d3.select(".progress").select("svg").remove();
    let svg = d3
      .select(".progress")
      .append("svg")
      .attr("height", "100%")
      .attr("width", "100%");
    svg
      .append("rect")
      .attr("class", "bg-rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "#CBD5E0")
      .attr("height", "100%")
      .attr("width", "100%");
    let progress = svg
      .append("rect")
      .attr("class", "progress-rect")
      .attr("fill", "#00BD3E")
      .attr("height", "100%")
      .attr("width", 0)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("y", 0);
    progress
      .transition()
      .duration(500)
      .attr("width", this.monthlyCompletionPercent + "%");
  }
}
