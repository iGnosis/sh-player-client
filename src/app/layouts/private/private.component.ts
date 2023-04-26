import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { ModalConfig } from 'src/app/types/pointmotion';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit, OnDestroy {
  showPaymentModal: boolean = false;
  showFeedbackButton: boolean = true;
  paymentModalConfig: ModalConfig;
  routeSubscription: Subscription;

  constructor(
    private dailyCheckinService: DailyCheckinService,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
  ) {
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
    this.routeSubscription = router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('signup')) {
          this.showFeedbackButton = false;
        } else {
          this.showFeedbackButton = true;
        }
        await this.fulfillPaymentDetailsRequirement();
        await this.showPaymentModalHandler();
      }
    });

    this.socketService.connect();
  }

  ngOnInit(): void {
    this.dailyCheckinService.isCheckedInToday().then((isCheckedInToday: boolean) => {
      if (!isCheckedInToday && !this.router.url.includes('signup')) {
        this.router.navigate(["app", "checkin"]);
      }
    })
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async fulfillPaymentDetailsRequirement() {
    const subscriptionObj = await this.authService.getSubscriptionDetails();
    console.log('fulfillPaymentDetailsRequirement::subscriptionObj::', subscriptionObj);
    const paymentMethodRequired = await this.authService.getPaymentMethodRequirement();
    console.log('fulfillPaymentDetailsRequirement::paymentMethodRequired::', paymentMethodRequired);
    const paymentMethodExist = subscriptionObj && Object.keys(subscriptionObj).length !== 0;
    console.log('fulfillPaymentDetailsRequirement::paymentMethodExist:', paymentMethodExist);

    if (!paymentMethodExist && paymentMethodRequired) {
      if (!this.router.url.includes('add-payment-method') && !this.router.url.includes('signup') && !this.router.url.includes('checkin'))
        this.router.navigate(['/app/add-payment-method', { signup: true }]);
    }
  }

  async showPaymentModalHandler() {
    const subscriptionStatus = await this.authService.getSubscriptionStatus();

    if (this.router.url.includes('add-payment-method') || this.router.url.includes('account-details')) {
      this.showPaymentModal = false;
    } else if (["payment_pending", "trial_expired", "cancelled"].includes(subscriptionStatus)) {
      // if url exists
      const paymentAuthUrl = await this.authService.getPaymentAuthUrl();
      if (paymentAuthUrl) {
        this.paymentModalConfig = {
          type: 'warning',
          title: 'Almost There!',
          body: 'For extra security of your account, you need to authenticate this transaction with your bank. Please click the button below to complete the transaction.',
          submitButtonLabel: 'Complete Payment',
          onSubmit: () => {
            window.open(paymentAuthUrl, "_blank");
            this.paymentModalConfig.body = 'Please click the button below once you have completed the authentication to refresh the page.'
            this.paymentModalConfig.submitButtonLabel = 'Refresh the page';
            this.paymentModalConfig.onSubmit = () => {
              window.location.reload();
            };
          },
        };
        this.showPaymentModal = true;
      } else {
        this.showPaymentModal = false;
      }
    } else {
      this.showPaymentModal = false;
    }
  }

}
