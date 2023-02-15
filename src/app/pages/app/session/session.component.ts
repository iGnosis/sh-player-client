import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtService } from "src/app/services/jwt.service";
import { environment } from "src/environments/environment";
import { debounceTime, fromEvent, Subscription } from "rxjs";
import { GoogleAnalyticsService } from "src/app/services/google-analytics/google-analytics.service";
import { ModalConfig } from "src/app/types/pointmotion";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit {
  url = "";
  sessionId = "";
  game: string = "";
  private resizeSubscription!: Subscription;

  showPaymentModal: boolean = false;
  paymentModalConfig: ModalConfig;

  @ViewChild("session") session!: ElementRef<HTMLIFrameElement>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private authService: AuthService,
  ) {
    if (environment.name == 'dev' || environment.name == 'local') {
      //@ts-ignore
      window['private'] = this;
    }

    this.game = this.route.snapshot.paramMap.get("game") as string;
    this.sessionId = this.route.snapshot.paramMap.get("id") as string;
    console.log(this.sessionId);
    this.url = environment.activityEndpoint + "?session=" + this.sessionId;

    this.paymentModalConfig = {
      type: 'warning',
      title: 'Payment Method Failed',
      body: 'Your payment method was declined, please update your payment method to continue using our services. Your data is always safe with us.',
      closeButtonLabel: 'Manage Account',
      submitButtonLabel: 'Update Payment Method',
      onClose: () => {
        this.router.navigate(['/app/account-details']);
      },
      onSubmit: () => {
        this.router.navigate(['/app/add-payment-method']);
      },
    };
    this.showPaymentModalHandler();
  }

  async showPaymentModalHandler() {
    const subscriptionStatus = await this.authService.getSubscriptionStatus();

    if (["payment_pending", "trial_expired", "cancelled"].includes(subscriptionStatus)) {
      this.showPaymentModal = true;
    } else {
      this.showPaymentModal = false;
    }
  }

  setGame(idx?: number) { 
    const games = ['sit_stand_achieve', 'beat_boxer', 'sound_explorer', 'moving_tones'];
    idx = (idx || 1) - 1;
    this.session.nativeElement.contentWindow?.postMessage(
      {
        type: 'set-game',
        game: games[idx],
      },
      "*"
    );
    console.log(`%cStarting ${games[idx]}`, "color:green");
  }

  ngOnInit(): void {

    this.resizeSubscription = fromEvent(window, "resize")
      .pipe(debounceTime(500))
      .subscribe((evt) => {
        this.googleAnalyticsService.sendEvent('window_resized')
      });

    window.addEventListener("message", async (event) => {
      if (event && event.data && event.data.type) {
        if (event.data.type === 'activity-experience-ready') {
          this.session.nativeElement.contentWindow?.postMessage(
            {
              type: 'token',
              token: this.jwtService.getToken(),
              session: this.sessionId,
              benchmarkId: this.route.snapshot.queryParamMap.get('benchmarkId'),
              game: this.game,
            },
            "*"
          );
        }
        // sends a latest valid access_token.
        else if (event.data.type === 'end-game') {
          this.router.navigate(['/app/home', { isVisitingAfterGame: true }])
        }
      }

      if (event && event.data && event.data.session && event.data.session.id) {
        this.router.navigate(['/app/home', { isVisitingAfterGame: true }])
      }
      if (event && event.data && event.data.type === 'check-auth' && !event.data.token) {
        this.jwtService.clearTokens();
      }
    }, false);
  }
}
