import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { Genre, Genres } from 'src/app/types/pointmotion';

@Component({
  selector: 'genre-selection',
  templateUrl: './genre-selection.component.html',
  styleUrls: ['./genre-selection.component.scss'],
  animations: [
    trigger('slideInOutTop', [
      transition(':enter', [
        style({transform: 'translate(-50%, -100px)', opacity: 0}),
        animate('200ms', style({transform: 'translate(-50%, 0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(-50%, 0)', opacity: 1}),
        animate('200ms', style({transform: 'translate(-50%, -100px)', opacity: 0}))
      ])
    ]),
  ],
})
export class GenreSelectionComponent {
  currentGenre: Genre = 'classical';
  genres = Genres;
  showToast = false;

  constructor(private graphqlService: GraphqlService) {
    const createdAfter = new Date();
    createdAfter.setHours(0, 0, 0, 0);
    this.graphqlService.gqlRequest(GqlConstants.GET_LATEST_USER_GENRE, { createdAfter: createdAfter.toISOString() }).then((res) => {
      if (res.checkin.length) {
        if (res.checkin[0].value === 'surprise me!')
          this.currentGenre = 'surprise-me';
        else
          this.currentGenre = res.checkin[0].value as Genre;
      }
    });
  }

  async setGenre(genre: Genre) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    await this.graphqlService.gqlRequest(GqlConstants.SET_USER_GENRE, { value: genre, createdAfter: date });

    this.currentGenre = genre;

    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

}
