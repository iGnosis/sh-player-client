import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { ModalConfig } from 'src/app/types/pointmotion';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  showPaymentModal: boolean = false;
  paymentModalConfig: ModalConfig;

  constructor(
    private dailyCheckinService: DailyCheckinService,
    private router: Router,
    private authService: AuthService,
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
    router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        await this.fulfillPaymentDetailsRequirement();
        await this.showPaymentModalHandler();
      }
    });
  }

  ngOnInit(): void {
    this.dailyCheckinService.isCheckedInToday().then((isCheckedInToday: boolean) => {
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
      }
    })
  }

  async fulfillPaymentDetailsRequirement() {
    const subscriptionObj = await this.authService.getSubscriptionDetails();
    const paymentMethodRequired = await this.authService.getPaymentMethodRequirement();
    const paymentMethodExist = subscriptionObj && Object.keys(subscriptionObj).length !== 0;
    
    if (!paymentMethodExist && paymentMethodRequired) {
      if (!this.router.url.includes('add-payment-method') && !this.router.url.includes('signup'))
        this.router.navigate(['/app/add-payment-method', { signup: true }]);
    }
  }

  async showPaymentModalHandler() {
    const subscriptionStatus = await this.authService.getSubscriptionStatus();

    if (this.router.url.includes('add-payment-method') || this.router.url.includes('account-details')) {
      this.showPaymentModal = false;
    } else if (["payment_pending", "trial_expired", "cancelled"].includes(subscriptionStatus)) {
      this.showPaymentModal = true;
    } else {
      this.showPaymentModal = false;
    }
  }

}
