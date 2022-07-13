import { Component, OnInit } from '@angular/core';
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

  constructor(private rewardsService: RewardsService) { }

  async ngOnInit() {
    this.rewards = await this.rewardsService.getRewards();
    this.rewardsUnlocked = this.rewards.filter((val) => val.isUnlocked === true).length;
  }

  async rewardAccessed(rewardTier: string) {
    console.log('rewardAccessed:reward:', rewardTier);
    this.currentReward = this.rewards.filter((val) => val.tier === rewardTier)[0];
    this.toggleRewardModal();
    this.rewardsService.markRewardAsAccessed(rewardTier);
  }
  
  toggleRewardModal() {
    this.showRewardModal = !this.showRewardModal;
  }
}
