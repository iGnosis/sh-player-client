/// <reference types="chrome"/>
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { Patient } from "src/app/types/pointmotion";
import { session } from "src/app/store/reducers/home.reducer";
import { trigger, transition, animate, style } from "@angular/animations";
import { GoalsService } from "src/app/services/goals/goals.service";
import { JwtService } from "src/app/services/jwt.service";
import { UserService } from "src/app/services/user.service";
import { RewardsDTO } from "src/app/types/pointmotion";
import { RewardsService } from "src/app/services/rewards/rewards.service";
import { GoogleAnalyticsService } from "src/app/services/google-analytics/google-analytics.service";
import { filter, pairwise, take } from "rxjs";
import { DailyCheckinService } from "src/app/services/daily-checkin/daily-checkin.service";

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
export class HomeComponent implements OnInit {
  user!: Patient;
  sessionId!: string;
  session = session.Start;

  monthlyCompletionPercent: number = 0;
  monthlyGoalPercent: number = 100;

  rewards!: RewardsDTO[];
  rewardsRange: number[] = [];
  currentReward: RewardsDTO | null = null;
  daysCompletedThisMonth = 0;

  currentDate = {
    month: new Date().toLocaleDateString("default", { month: "long" }),
    monthIndex: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  sessions: any = [];
  nextSession: any = {};

  isVisitingAfterSession = false;

  constructor(
    private careplanService: CareplanService,
    private goalsService: GoalsService,
    private rewardsService: RewardsService,
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private dailyCheckinService: DailyCheckinService
  ) {
    this.user = this.userService.get();
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise(), take(1))
      .subscribe(this.recordGAEvents);
    this.sendTokenToExtension();
  }

  async ngOnInit(): Promise<void> {
    this.initHome();
    this.dailyCheckinService.isCheckedInToday().then(isCheckedInToday => {
      console.log('isCheckedInToday:', isCheckedInToday);
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
      }
    })
  }

  recordGAEvents = (events: RoutesRecognized[]) => {
    this.isVisitingAfterSession = events[0].urlAfterRedirects === '/app/session/';
    if (this.isVisitingAfterSession) {
      this.googleAnalyticsService.sendEvent('end_game');
      this.googleAnalyticsService.sendEvent('monthly_goals', {
        completionPercent: this.monthlyCompletionPercent
      });
      this.googleAnalyticsService.sendEvent('daily_goals', {
        activities: this.sessions,
      });
    }
  }

  sendTokenToExtension() {
    const sendOnInterval = setInterval(() => {
      window.postMessage({ type: "TOKEN", token: this.jwtService.getToken() }, "*");
    }, 1000);
    onmessage = (e) => {
      if (e.data === "token-recieved") {
        clearInterval(sendOnInterval);
      }
    }
  }

  async initHome() {
    this.rewards = await this.rewardsService.getRewards();

    this.getMonthlyGoals();
    this.getDailyGoals();

    const unlockedRewards = this.rewards.filter((reward: RewardsDTO) => reward.isUnlocked && !reward.isViewed);
    if (unlockedRewards.length) {
      this.displayRewardCard(unlockedRewards[0]);
    }
  }

  async displayRewardCard(reward: RewardsDTO) {
    await this.rewardsService.markRewardAsViewed(reward.tier);
    this.googleAnalyticsService.sendEvent('unlock_achievement', {
      tier: reward.tier,
    });
    this.currentReward = reward;
  }

  closeRewardCard() {
    this.currentReward = null;
  }

  async startNewSession() {
    this.googleAnalyticsService.sendEvent('start_game');
    this.router.navigate(["/app/session/"]);
  }

  async getMonthlyGoals() {
    let firstDayOfMonth = new Date(this.currentDate.year, this.currentDate.monthIndex, 1);
    let lastDayOfMonth = new Date(this.currentDate.year, this.currentDate.monthIndex + 1, 0);

    firstDayOfMonth.setHours(0, 0, 0, 0);
    lastDayOfMonth.setHours(24, 0, 0, 0);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.userService.updateTimezone(userTimezone);

    const response =
      await this.goalsService.getMonthlyGoals(
        firstDayOfMonth.toISOString(),
        lastDayOfMonth.toISOString(),
        userTimezone
      );

    this.daysCompletedThisMonth = response.daysCompleted || 0;

    lastDayOfMonth = new Date(this.currentDate.year, this.currentDate.monthIndex + 1, 0);
    this.monthlyCompletionPercent = this.daysCompletedThisMonth / lastDayOfMonth.getDate() * 100;
  }

  async getDailyGoals() {
    const availableGames: {
      game_name: string[];
    } = await this.careplanService.getAvailableGames();
    const games = availableGames.game_name;

    // hard-coding game names to preserve the order.
    let dailyGoalsActivities = await this.goalsService.getDailyGoals([
      'sit_stand_achieve',
      'beat_boxer',
      'sound_explorer'
    ]);

    let activitiesWithStatus = dailyGoalsActivities.map(this.mapActivitiesWithStatus);

    this.sessions = games.map((item: string, idx: number) => Object.assign({}, item, activitiesWithStatus[idx]));
    this.getNextSession();
  }

  mapActivitiesWithStatus(item: any, idx: number, arr: any[]) {
    let status = session.Start;

    if (item.isCompleted) status = session.Completed;

    if (idx !== 0) {
      if (item.isCompleted !== arr[idx - 1].isCompleted) status = session.Start;
      else if (!item.isCompleted) status = session.Locked;
    }

    return {
      ...item,
      status,
    }
  }

  getNextSession() {
    const idxOfCurrentSession = this.sessions.findIndex((item: any) => item.status === session.Start);
    if (idxOfCurrentSession === -1) {
      this.nextSession = this.sessions[0];
    } else {
      this.nextSession = this.sessions[idxOfCurrentSession];
    }
  }

  getBackgroundName(name?: string) {
    return (name || '').replace(/\s/g, "-").toLowerCase();
  }
}
