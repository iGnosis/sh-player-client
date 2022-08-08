import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RewardsDTO } from 'src/app/types/pointmotion';

@Component({
  selector: 'share-reward-modal',
  templateUrl: './share-reward-modal.component.html',
  styleUrls: ['./share-reward-modal.component.scss']
})
export class ShareRewardModalComponent implements OnInit {
  @Input() currentReward!: RewardsDTO;
  @Output() changeModalState = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  copyCodeToClipboard(code: string) {
    navigator.clipboard.writeText(code);
  }

  toggleModal() {
    this.changeModalState.emit();
  }

}
