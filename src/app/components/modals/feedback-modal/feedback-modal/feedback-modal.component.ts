import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';
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

  constructor(private userService: UserService, private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }
  toggleFeedbackModal() {
    if(this.recommendationScoreModal) {
      this.submitProductFeedback();
    } else {
      this.feedbackModal = !this.feedbackModal;
    }
    if (this.feedbackModal) {
      this.googleAnalyticsService.sendEvent('open_feedback_modal');
    }
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
    this.googleAnalyticsService.sendEvent('submit_product_feedback', {
      rating: this.currentRating,
    });
    this.toggleFeedbackModal();
    this.clearFeedbackForm();
    this.toggleRecommendationScoreModal();
  }
  submitProductFeedback() {
    if(this.currentRecommendationScore > 0) {
      this.userService.sendRecommendationScore(this.feedbackId, this.currentRecommendationScore);
      this.googleAnalyticsService.sendEvent('submit_recommendation_feedback', {
        recommendation_score: this.currentRecommendationScore,
      });
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
