import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help/help.service';
import { RewardsDTO } from 'src/app/types/pointmotion';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
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
  constructor(private helpService: HelpService) { }

  ngOnInit(): void {
  }

  accessSoundhealthFaq() {
    this.helpService.faqAccessed();
    this.helpService.goToLink('https://www.pointmotion.us/index.php/docs/');
  }

  freeParkinsonResourcesAccessed() {
    this.helpService.freeParkinsonResourcesAccessed();
    this.helpService.goToLink('https://www.parkinson.org/Living-with-Parkinsons/Resources-and-Support');
  }

  toggleRewardModal() {
    this.showRewardModal = !this.showRewardModal;
    this.helpService.freeRewardAccessed();
  }
}
