import { Injectable } from "@angular/core";
import { Howl } from "howler";

@Injectable({
  providedIn: "root",
})
export class SoundsService {
  preSessionGenreClassicalId!: number;
  preSessionGenreJazzId!: number;
  preSessionGenreRockId!: number;
  preSessionGenreDanceId!: number;
  preSessionGenreSurpriseId!: number;
  constructor() {}

  preSessionGenreClassical: Howl = new Howl({
    src: "assets/sounds/genre soundscapes/classical.mp3",
    html5: true,
    loop: true,
  });
  preSessionGenreJazz: Howl = new Howl({
    src: "assets/sounds/genre soundscapes/jazz.mp3",
    html5: true,
    loop: true,
  });
  preSessionGenreRock: Howl = new Howl({
    src: "assets/sounds/genre soundscapes/rock.mp3",
    html5: true,
    loop: true,
  });
  preSessionGenreDance: Howl = new Howl({
    src: "assets/sounds/genre soundscapes/dance.mp3",
    html5: true,
    loop: true,
  });
  preSessionGenreSurprise: Howl = new Howl({
    src: "assets/sounds/genre soundscapes/surprise_me.mp3",
    html5: true,
    loop: true,
  });

  playGenreSound(genre: string) {
    console.log("playing ", genre);
    switch (genre) {
      case "Classical":
        if (
          !this.preSessionGenreClassical.playing(this.preSessionGenreClassicalId)
        ) {
          console.log(genre);
          this.preSessionGenreClassicalId = this.preSessionGenreClassical
            .fade(0, 80, 3000, this.preSessionGenreClassicalId)
            .play();
        }
        break;
      case "Jazz":
        if (!this.preSessionGenreJazz.playing(this.preSessionGenreJazzId)) {
          console.log(genre);
          this.preSessionGenreJazzId = this.preSessionGenreJazz
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case "Rock":
        if (!this.preSessionGenreRock.playing(this.preSessionGenreRockId)) {
          console.log(genre);
          this.preSessionGenreRockId = this.preSessionGenreRock
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case "Dance":
        if (!this.preSessionGenreDance.playing(this.preSessionGenreDanceId)) {
          console.log(genre);
          this.preSessionGenreDanceId = this.preSessionGenreDance
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case "Surprise Me!":
        if (
          !this.preSessionGenreSurprise.playing(this.preSessionGenreSurpriseId)
        ) {
          console.log(genre);
          this.preSessionGenreSurpriseId = this.preSessionGenreSurprise
            .fade(0, 80, 3000)
            .play();
        }
        break;
    }
  }
}
