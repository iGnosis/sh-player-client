import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RewardsDTO } from 'src/app/types/pointmotion';

@Component({
  selector: 'share-reward-modal',
  templateUrl: './share-reward-modal.component.html',
  styleUrls: ['./share-reward-modal.component.scss']
})
export class ShareRewardModalComponent implements OnInit {
  @Input() currentReward!: RewardsDTO;
  @Output() changeModalState = new EventEmitter();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  copyCodeToClipboard(code: string) {
    this._snackBar.open('Copied to clipboard', 'Dismiss', {
      duration: 2000,
      panelClass: 'snackbar-primary',
    });
    navigator.clipboard.writeText(code);
  }

  toggleModal() {
    this.changeModalState.emit();
  }

}
