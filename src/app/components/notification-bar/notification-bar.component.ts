import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent {
  daysLeft: number = 0;
  show = false;

  constructor(private gqlService: GraphqlService, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        await this.notifyStatus();
      }
    });
  }

  async notifyStatus() {
    const status = await this.authService.getSubscriptionStatus();
    const subscriptionObj = await this.authService.getSubscriptionDetails();

    const patientDetails = await this.authService.getPatientDetails();
    const trialPeriod = await this.gqlService.gqlRequest(GqlConstants.GET_TRIAL_PERIOD);

    if (!subscriptionObj || !subscriptionObj.current_period_end) {
      if (!patientDetails || !trialPeriod || !trialPeriod.subscription_plans) return;

      const currentPeriodStart = new Date(patientDetails.createdAt);
      const today = new Date();
      this.daysLeft = trialPeriod.subscription_plans[0].trialPeriod - Math.floor((today.getTime() - currentPeriodStart.getTime()) / (1000 * 3600 * 24));
    } else {
      const currentPeriodEnd = new Date(subscriptionObj.current_period_end * 1000);
      const today = new Date();
      this.daysLeft = Math.floor((currentPeriodEnd.getTime() - today.getTime()) / (1000 * 3600 * 24));  
    }

    if (status === 'trial_period' && this.daysLeft <= 5 && !subscriptionObj) {
      this.show = true;
    }

    const paymentAdded = this.route.snapshot.queryParams['paymentAdded'];
    if (paymentAdded) {
      this.show = true;
    }
  }
  
  hide() {
    this.show = false;
    this.router.navigate([], {
      queryParams: {
        'paymentAdded': null,
      },
      queryParamsHandling: 'merge'
    })
  }
}
