import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";

@Injectable({
  providedIn: "root",
})
export class GoalsService {
  constructor(private graphqlService: GraphqlService) {}

  async getMonthlyGoals(month: number, year: number) {
    const monthlyGoals = await this.graphqlService.client.request(
      GqlConstants.GET_MONTHLY_GOALS,
      { month, year }
    );
    return monthlyGoals.patientMonthlyGoals.data;
  }
  async getDailyGoals(date: string) {
    const dailyGoals = await this.graphqlService.client.request(
      GqlConstants.GET_DAILY_GOALS,
      { date }
    );
    return dailyGoals.patientDailyGoals.dailyMinutesCompleted;
  }
  async getStreak() {
    const streak = await this.graphqlService.client.request(GqlConstants.GET_STREAK);
    return streak.patientSessionStreak.streak;
  }
}
