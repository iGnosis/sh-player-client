import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent {
  daysLeft: number = 0;
  show = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        await this.notifyStatus();
      }
    });
  }

  async notifyStatus() {
    const status = await this.authService.getSubscriptionStatus();
    const subscriptionObj = await this.authService.getSubscriptionDetails();
    if (!subscriptionObj || !subscriptionObj.current_period_end) return;
    
    const currentPeriodEnd = new Date(subscriptionObj.current_period_end * 1000);
    const today = new Date();
    this.daysLeft = Math.floor((currentPeriodEnd.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (status === 'trial_period' && this.daysLeft <= 5) {
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
