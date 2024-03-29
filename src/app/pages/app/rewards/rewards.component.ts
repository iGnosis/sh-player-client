import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
import { JwtService } from 'src/app/services/jwt.service';
import { RewardsService } from 'src/app/services/rewards/rewards.service';
import { RewardsDTO } from 'src/app/types/pointmotion';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})

export class RewardsComponent implements OnInit {
  rewardsUnlocked: number = 0;
  rewards: Array<RewardsDTO> = [];
  showRewardModal: boolean = false;
  currentReward!: RewardsDTO;

  constructor(private rewardsService: RewardsService, private googleAnalyticsService: GoogleAnalyticsService) { }

  async ngOnInit() {
    this.rewards = await this.rewardsService.getRewards();
    this.rewardsUnlocked = this.rewards.filter((val) => val.isUnlocked === true).length;
  }

  async rewardAccessed(rewardTier: string) {
    console.log('rewardAccessed:reward:', rewardTier);
    this.currentReward = this.rewards.filter((val) => val.tier === rewardTier)[0];
    this.toggleRewardModal();
    this.rewardsService.markRewardAsAccessed(rewardTier);
    this.googleAnalyticsService.sendEvent('access_reward', {
      tier: this.currentReward.tier,
    });
  }

  toggleRewardModal() {
    this.showRewardModal = !this.showRewardModal;
  }
}
