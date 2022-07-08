import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { SessionService } from "src/app/services/session/session.service";
import { Patient } from "src/app/types/pointmotion";
import { session } from "src/app/store/reducers/home.reducer";
import { trigger, transition, animate, style } from "@angular/animations";
import { GoalsService } from "src/app/services/goals/goals.service";
import * as d3 from "d3";
import { JwtService } from "src/app/services/jwt.service";
import { UserService } from "src/app/services/user.service";
import { AnimationOptions } from "ngx-lottie";

interface RewardsDTO {
  tier: "bronze" | "silver" | "gold";
  isViewed: boolean;
  isUnlocked: boolean;
  isVisited: boolean;
  isAccessed: boolean;
  description: string;
  unlockAtDayCompleted: number;
}

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
  user!: Patient;
  careplanId!: string;
  activeCareplans: any;
  sessionId!: string;
  session = session.Start;
  currentSession = 0;

  monthlyCompletionPercent: number = 0;
  monthlyGoalPercent: number = 100;
  monthRange = d3.range(0, 30.5, 1);

  // TODO: has to be changed based on monthly goals API
  rewards!: RewardsDTO[];
  rewardsRange: number[] = [];
  currentReward: RewardsDTO | null = null;
  daysCompletedThisMonth = 0;

  // TODO: has to be changed based on daily goals API
  minutesCompletedToday = 0;

  currentDate = {
    day: `${new Date().getDate()}${this.nth(new Date().getDate())}`,
    month: new Date().toLocaleDateString("default", { month: "long" }),
    monthIndex: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  dailyCompletionPercent: number = 0;
  sessionType = session;

  sessions: any = [];
  nextSession: any = {};
  
  options: AnimationOptions = {    
    path: '/assets/images/animations/wave.json'  
  };  

  constructor(
    private careplanService: CareplanService,
    private sessionService: SessionService,
    private goalsService: GoalsService,
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    this.user = this.userService.get();
  }

  async ngOnInit(): Promise<void> {
    this.rewards = await this.goalsService.getRewards();

    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    this.activeCareplans = await this.careplanService.getActiveCareplans();
    
    this.getMonthlyGoals();
    this.getDailyGoals();

    const unlockedRewards = this.rewards.filter((reward: RewardsDTO) => reward.isUnlocked && !reward.isViewed);
    if(unlockedRewards.length) {
      this.displayRewardCard(unlockedRewards[0]);
    }
  }

  async displayRewardCard(reward: RewardsDTO) {
    await this.goalsService.markRewardAsViewed(reward.tier);
    this.currentReward = reward;
  }

  closeRewardCard() {
    this.currentReward = null;
  }

  ngAfterViewInit(): void {
    this.initMonthlyBar();
  }

  nextSessionState() {
    if (this.sessions[this.currentSession].status === session.Completed) {
      this.currentSession++;
    } else if (
      this.sessions[this.currentSession].status === session.Locked
    ) {
      this.sessions[this.currentSession].status = session.Start;
    } else {
      this.sessions[this.currentSession].status++;
    }
  }

  async startNewSession() {
    if (this.jwtService.checkCareplanAndProviderInJWT()) {
      if (this.activeCareplans.careplan.length > 0) {
        this.careplanId = this.activeCareplans.careplan[0].id;
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

  async getMonthlyGoals() {
    const firstDayOfMonth = new Date(this.currentDate.year, this.currentDate.monthIndex, 1);
    const lastDayOfMonth = new Date(this.currentDate.year, this.currentDate.monthIndex + 1, 0);
 
    this.monthlyCompletionPercent = this.daysCompletedThisMonth / lastDayOfMonth.getDate() * 100;

    firstDayOfMonth.setHours(0,0,0,0);
    lastDayOfMonth.setHours(24,0,0,0);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = 
      await this.goalsService.getMonthlyGoals(
        firstDayOfMonth.toISOString(), 
        lastDayOfMonth.toISOString(), 
        userTimezone
      );

    this.daysCompletedThisMonth = response.daysCompleted || 0;
    this.rewardsRange = response.rewardsCountDown;

    this.initMonthlyBar();
  }

  async getDailyGoals() {
    const activitiesResponse = await this.careplanService.getCareplanActivities();
    const activityList = activitiesResponse.careplan_activity;

    const activities = activityList.map((item: any) => item.activityByActivity.id);
    const today = new Date();
    today.setHours(0,0,0,0);

    const dailyGoalsRes = await this.goalsService.getDailyGoals(activities, today.toISOString());
    let dailyGoalsActivities = dailyGoalsRes.patientDailyGoals.data.activities;

    dailyGoalsActivities = dailyGoalsActivities.map((item: any, idx: number) => { //sets activity status
      let status = session.Start;
      if(item.isCompleted) status = session.Completed;
      if(idx !== 0) {
        if(item.isCompleted !== dailyGoalsActivities[idx-1].isCompleted) status = session.Start;
        else if(!item.isCompleted) status = session.Locked;
      }
      return {
        ...item,
        status,
      }
    });

    this.sessions = activityList.map((item: any, idx: number) => {
      return Object.assign({}, item.activityByActivity, dailyGoalsActivities[idx]) // merge arrays
    })

    const idxOfCurrentSession = this.sessions.findIndex((item: any) => item.status === session.Start);
    if(idxOfCurrentSession === -1) {
      this.dailyCompletionPercent = 100;
      this.nextSession = this.sessions[0];
    } else {
      this.dailyCompletionPercent = Math.min(idxOfCurrentSession, 2) *50;
      this.nextSession = this.sessions[idxOfCurrentSession];
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
