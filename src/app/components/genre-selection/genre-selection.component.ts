import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { SoundsService } from 'src/app/services/sounds/sounds.service';
import { Genre, Genres } from 'src/app/types/pointmotion';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'genre-selection',
  templateUrl: './genre-selection.component.html',
  styleUrls: ['./genre-selection.component.scss'],
  animations: [
    trigger('slideInOutTop', [
      transition(':enter', [
        style({ transform: 'translate(-50%, -100px)', opacity: 0 }),
        animate(
          '200ms',
          style({ transform: 'translate(-50%, 0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translate(-50%, 0)', opacity: 1 }),
        animate(
          '200ms',
          style({ transform: 'translate(-50%, -100px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class GenreSelectionComponent {
  currentGenre: Genre = 'classical';
  genres = Genres;
  showToast = false;

  constructor(
    private authService: AuthService,
    private soundsService: SoundsService
  ) {
    const createdAfter = new Date();
    createdAfter.setHours(0, 0, 0, 0);
    this.authService.getPatientDetails().then((res) => {
      if (res.genreChoice) {
        if (environment.name === 'dev' || environment.name === 'local') {
          this.soundsService.playLoungeSound(res.checkin[0].value as Genre);
        }
        if (res.checkin[0].value === 'surprise me!')
          this.currentGenre = 'surprise-me';
        else this.currentGenre = res.genreChoice as Genre;
      }
    });
  }

  async setGenre(genre: Genre) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    await this.authService.setGenreChoice(genre);

    this.currentGenre = genre;

    if (environment.name === 'dev' || environment.name === 'local') {
      this.soundsService.playLoungeSound(genre);
    }

    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
