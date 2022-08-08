import { Injectable } from "@angular/core";
import { GqlConstants } from "src/app/services/gql-constants/gql-constants.constants";
import { GraphqlService } from "src/app/services/graphql/graphql.service";
import { DailyGoalsApiDTO } from "src/app/types/pointmotion";

@Injectable({
  providedIn: "root",
})
export class GoalsService {
  constructor(private graphqlService: GraphqlService) {}

  async getMonthlyGoals(startDate: string, endDate: string, userTimezone: string) {
    const monthlyGoals = await this.graphqlService.gqlRequest(
      GqlConstants.GET_MONTHLY_GOALS,
      { startDate, endDate, userTimezone }
    );
    return monthlyGoals.patientMonthlyGoals.data;
  }

  async getDailyGoals(gamesToQuery: string[]): Promise<DailyGoalsApiDTO[]> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // get the game data for the current date.
    const gamesData = await this.graphqlService.gqlRequest(
      GqlConstants.GET_GAMES_DATA,
      { startDate: startDate, endDate: new Date() }
    );

    // get only unique game names.
    const completedGamesNames: string[] = gamesData.game.map((val: any) => val.game);
    const uniqueCompletedGamesNames = [... new Set(completedGamesNames)];

    // construct the response DTO.
    let result: DailyGoalsApiDTO[] = [];
    gamesToQuery.forEach((gameName: string) => {
      if (uniqueCompletedGamesNames.includes(gameName)) {
        result.push({
          name: this._humanifyGameNames(gameName),
          isCompleted: true
        })
      } else {
        result.push({
          name: this._humanifyGameNames(gameName),
          isCompleted: false
        })
      }
    })
    return result;
  }

  async getStreak() {
    const streak = await this.graphqlService.gqlRequest(GqlConstants.GET_STREAK);
    return streak.patientSessionStreak.streak;
  }

  async getLevel() {
    return 1;
  }

  // converts sit_stand_achieve --to--> Sit Stand Achieve
  _humanifyGameNames(gameName: string) {
    let name = '';
    const splitByUnderscores = gameName.split('_');
    splitByUnderscores.forEach(str => {
      name += ' ' + str.charAt(0).toUpperCase() + str.slice(1);
    })
    return name;
  }
}
