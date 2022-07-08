import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class GoalsService {
  constructor(private graphqlService: GraphqlService) {}

  async getMonthlyGoals(startDate: string, endDate: string, userTimezone: string) {
    try {
      const monthlyGoals = await this.graphqlService.client.request(
        GqlConstants.GET_MONTHLY_GOALS,
        { startDate, endDate, userTimezone }
      );
      return monthlyGoals.patientMonthlyGoals.data;
    } catch(e) {
      console.log(e);
    }
  }
  async getDailyGoals(activityIds: string[], date: string) {
    try {
      const dailyGoals = await this.graphqlService.client.request(
        GqlConstants.GET_DAILY_GOALS,
        { activityIds, date }
      );
      return dailyGoals;
    } catch(e) { 
      console.log(e);
    }
  }
  async getRewards() {
    try {
      const response = await this.graphqlService.client.request(GqlConstants.GET_PATIENT_REWARDS);
      return response.patient[0].rewards;
    } catch(e) {
      console.log(e);
    }
  }
  async markRewardAsViewed(rewardTier: string) {
    try {
      const response = await this.graphqlService.client.request(GqlConstants.MARK_REWARD_AS_VIEWED, { rewardTier });
      return response;
    } catch(e) {
      console.log(e);
    }
  }
  async getStreak() {
    const streak = await this.graphqlService.client.request(GqlConstants.GET_STREAK);
    return streak.patientSessionStreak.streak;
  }
  async getLevel() {
    return 1;
  }
}
