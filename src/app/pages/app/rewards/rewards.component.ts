import { Component, OnInit } from '@angular/core';

interface RewardsDTO {
  isUnlocked: boolean;
  rewardTier: 'bronze' | 'silver' | 'gold';
  title: string;
}

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
  rewardsUnlocked?: number;
  rewards: Array<RewardsDTO>;

  constructor() {
    this.rewards = [
      {
        isUnlocked: true,
        rewardTier: 'bronze',
        title: '10% off on all therapy equipment from EXERTOOLS'
      },
      {
        isUnlocked: true,
        rewardTier: 'silver',
        title: '15% off on all therapy equipment from EXERTOOLS'
      },
      {
        isUnlocked: false,
        rewardTier: 'gold',
        title: '20% off on all therapy equipment from EXERTOOLS'
      }
    ]
    this.rewardsUnlocked = this.rewards.filter((val) => val.isUnlocked === true).length;
  }

  ngOnInit(): void { }

}
