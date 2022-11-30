import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { HelpService } from 'src/app/services/help/help.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { RewardsDTO } from 'src/app/types/pointmotion';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  logoUrl = "/assets/icons/sound_health_logo_alpha.png";
  showRewardModal: boolean = false;
  currentReward: RewardsDTO = {
    tier: "bronze",
    isViewed: false,
    isUnlocked: false,
    isAccessed: false,
    unlockAtDayCompleted: 0,
    description: "5% off on all therapy equipment from EXERTOOLS",
    couponCode: "PTMONU",
  }
  constructor(
    private helpService: HelpService, 
    private googleAnalyticsService: GoogleAnalyticsService,
    private themeService: ThemeService,
  ) {
    const logoSubscription = this.themeService.logoSubject.subscribe((url) => {
      this.logoUrl = url
      if (url)
        logoSubscription.unsubscribe();
    });
  }

  ngOnInit(): void {
  }

  accessSoundhealthFaq() {
    this.helpService.faqAccessed();
  }

  freeParkinsonResourcesAccessed() {
    this.helpService.freeParkinsonResourcesAccessed();
  }

  toggleRewardModal() {
    this.showRewardModal = !this.showRewardModal;
    this.helpService.freeRewardAccessed();
    if (this.showRewardModal) {
      this.googleAnalyticsService.sendEvent('access_reward', {
        tier: this.currentReward.tier,
      });
    }
  }
}
