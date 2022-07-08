import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  feedbackModal: boolean = false;
  feedbackRecievedModal: boolean = false;
  currentRating: number = 0;
  currentProductRating: number = 0;

  constructor() { }

  ngOnInit(): void {
  }
  toggleFeedbackModal() {
    this.feedbackModal = !this.feedbackModal;
  }
  setCurrentRating(i: number) {
    this.currentRating = i;
  }
  toggleFeedbackRecievedModal() {
    this.feedbackModal = false;
    this.feedbackRecievedModal = !this.feedbackRecievedModal;
  }
  setProductRating(i: number) {
    this.currentProductRating = i;
  }

}
