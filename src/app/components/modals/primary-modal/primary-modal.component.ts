import { Component, Input, OnInit } from '@angular/core';
import { ModalConfig } from 'src/app/types/pointmotion';

@Component({
  selector: 'primary-modal',
  templateUrl: './primary-modal.component.html',
  styleUrls: ['./primary-modal.component.scss']
})
export class PrimaryModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @Input() public show: boolean;
  constructor() {
    this.show = false;
    this.modalConfig = {
      type: 'primary',
      title: '',
      body: '',
      closeButtonLabel: 'Close',
      submitButtonLabel: 'Submit',
      onClose: () => {},
      onSubmit: () => {},
    };
  }

  ngOnInit(): void {
  }

}
