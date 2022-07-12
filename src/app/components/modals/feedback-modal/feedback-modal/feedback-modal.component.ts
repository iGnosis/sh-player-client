import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  feedbackModal: boolean = false;
  recommendationScoreModal: boolean = false;
  currentRating: number = 0;
  description: string = "";
  feedbackId: string = "";
  currentRecommendationScore: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }
  toggleFeedbackModal() {
    this.feedbackModal = !this.feedbackModal;
  }
  setCurrentRating(i: number) {
    this.currentRating = i;
  }
  clearFeedbackForm() {
    this.currentRating = 0;
    this.description = "";
    this.currentRecommendationScore = 0;
  }
  async submitFeedback() {
    this.feedbackId = await this.userService.sendUserFeedback(this.currentRating, this.description);
    this.toggleFeedbackModal();
    this.clearFeedbackForm();
    this.toggleRecommendationScoreModal();
  }
  submitProductFeedback() {
    if(this.currentRecommendationScore > 0) {
      this.userService.sendRecommendationScore(this.feedbackId, this.currentRecommendationScore);
    }
    this.toggleRecommendationScoreModal();
    this.clearFeedbackForm();
  }
  toggleRecommendationScoreModal() {
    this.recommendationScoreModal = !this.recommendationScoreModal;
  }
  setProductRating(i: number) {
    this.currentRecommendationScore = i;
  }

}
