/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { ErpNextEventTypes, ModalConfig, Patient } from "src/app/types/pointmotion";
import { session } from "src/app/types/pointmotion";
import { trigger, transition, animate, style } from "@angular/animations";
import { GoalsService } from "src/app/services/goals/goals.service";
import { JwtService } from "src/app/services/jwt.service";
import { UserService } from "src/app/services/user.service";
import { RewardsDTO } from "src/app/types/pointmotion";
import { RewardsService } from "src/app/services/rewards/rewards.service";
import { GoogleAnalyticsService } from "src/app/services/google-analytics/google-analytics.service";
import { filter, pairwise, take } from "rxjs";
import { environment } from "src/environments/environment";
import { SoundsService } from "src/app/services/sounds/sounds.service";

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
    trigger("fadeText", [
      transition('* => *', [
        style({ opacity: '0' }),
        animate("200ms ease-in", style({ opacity: '1' })),
      ]),
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
  nextSessionIdx: number = 0;

  isVisitingAfterSession = false;
  showFeedbackForm = false;

  showDeviceWarning = false;
  deviceWarningConfig: ModalConfig = {
    type: 'warning',
    title: 'Please switch to a larger screen',
    body: 'Playing the activities are not supported on mobile devices. Please use a laptop or desktop computer to play. Thank you!',
    submitButtonLabel: 'Done',
    onSubmit: () => {
      this.showDeviceWarning = false;
    },
  };

  constructor(
    private careplanService: CareplanService,
    private goalsService: GoalsService,
    private rewardsService: RewardsService,
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private route: ActivatedRoute,
    private soundsService: SoundsService
  ) {
    const isVisitingAfterGame = this.route.snapshot.queryParamMap.get("isVisitingAfterGame");
    if (isVisitingAfterGame) {
      this.showFeedbackForm = true;
      this.googleAnalyticsService.sendEvent('open_feedback_modal');
      this.router.navigate([], { queryParams: { isVisitingAfterGame: null }, queryParamsHandling: 'merge', relativeTo: this.route });
    }

    const erpNextActionType = this.route.snapshot.queryParamMap.get("actionType") as ErpNextEventTypes;
    this.userService.erpNextEvent(erpNextActionType);

    this.user = this.userService.get();
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise(), take(1))
      .subscribe(this.recordGAEvents);
    this.sendTokenToExtension();
  }

  async ngOnInit(): Promise<void> {
    this.initHome();
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
    if (environment.name === 'dev' || environment.name === 'local') {
          this.soundsService.stopLoungeSound();
    }
    this.googleAnalyticsService.sendEvent('start_game');
    await this.router.navigate([], { queryParams: { isVisitingAfterGame: true }, queryParamsHandling: 'merge', relativeTo: this.route });
    this.router.navigate(["/app/session/", { game: this.nextSession.name.replace(/\s/g, "_").toLowerCase() }]);
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
      'sound_explorer',
      'moving_tones',
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
    let nextSessionIdx = -1;
    if (sessionStorage.getItem('random-session')) {
      nextSessionIdx = Number(sessionStorage.getItem('random-session'));
    } else {
      nextSessionIdx = Math.floor(Math.random() * this.sessions.length);
      sessionStorage.setItem('random-session', nextSessionIdx.toString());
    }

    this.nextSession = this.sessions[nextSessionIdx];
    this.nextSessionIdx = nextSessionIdx;
  }

  nextGame() {
    if (this.nextSessionIdx < this.sessions.length - 1) {
      this.nextSessionIdx++;
    }

    this.nextSession = this.sessions[this.nextSessionIdx];
  }

  prevGame() {
    if (this.nextSessionIdx > 0) {
      this.nextSessionIdx--;
    }

    this.nextSession = this.sessions[this.nextSessionIdx];
  }

  getBackgroundName(name?: string) {
    return (name || '').replace(/\s/g, "-").toLowerCase();
  }
}
