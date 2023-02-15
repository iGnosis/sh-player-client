import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { Genre } from 'src/app/types/pointmotion';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  preSessionGenreClassicalId!: number;
  preSessionGenreJazzId!: number;
  preSessionGenreRockId!: number;
  preSessionGenreDanceId!: number;
  preSessionGenreSurpriseId!: number;
  constructor() {}

  loginSound: Howl = new Howl({
    src: 'assets/sounds/Sound Health Soundscape_LogIn.mp3',
    html5: true,
  });

  preSessionGenreClassical: Howl = new Howl({
    src: 'assets/sounds/genre soundscapes/classical.mp3',
    html5: true,
    loop: true,
  });
  preSessionGenreJazz: Howl = new Howl({
    src: 'assets/sounds/genre soundscapes/jazz.mp3',
    html5: true,
    loop: true,
  });
  preSessionGenreRock: Howl = new Howl({
    src: 'assets/sounds/genre soundscapes/rock.mp3',
    html5: true,
    loop: true,
  });
  preSessionGenreDance: Howl = new Howl({
    src: 'assets/sounds/genre soundscapes/dance.mp3',
    html5: true,
    loop: true,
  });
  preSessionGenreSurprise: Howl = new Howl({
    src: 'assets/sounds/genre soundscapes/surprise_me.mp3',
    html5: true,
    loop: true,
  });

  feelingsSelectionSoundId?: number;
  feelingsSelectionSound: Howl = new Howl({
    src: 'assets/sounds/Sound Health Soundscape_Feeling Selection.mp3',
    html5: true,
    loop: false,
  });
  feelingsSelectionPromptSoundId?: number;
  feelingsSelectionPromptSound: Howl = new Howl({
    src: 'assets/sounds/Sound Health Soundscape_Feelings Prompt.mp3',
    html5: true,
    loop: true,
  });

  src: { [key in Genre]?: string[] } = {
    afro: [
      'assets/sounds/lounge/afro/afro_lounge_1.mp3',
      'assets/sounds/lounge/afro/afro_lounge_2.mp3',
    ],
  };

  getRandomSrc(genre: Genre) {
    if (!this.src[genre]) return;

    return this.src[genre]![
      Math.floor(Math.random() * this.src[genre]!.length)
    ];
  }

  loungeSound: Howl | undefined;
  loungeSoundId: number | undefined;
  playLoungeSound(genre: Genre) {
    if (this.loungeSound && this.loungeSound.playing(this.loungeSoundId)) {
      this.loungeSound.stop();
      this.loungeSound.unload();
    }

    const src = this.getRandomSrc(genre);
    // play only if src is available
    if (!src) return;

    this.loungeSound = new Howl({
      src,
      html5: true,
      loop: true,
    });
    this.loungeSoundId = this.loungeSound.play();

    // added initial fade.. so that it doesn't start with full volume
    this.loungeSound.fade(0, 60, 3000, this.loungeSoundId);
  }

  stopLoungeSound() {
    if (this.loungeSound && this.loungeSound.playing(this.loungeSoundId)) {
      this.loungeSound.stop();
      this.loungeSound.unload();
    }
  }

  playGenreSound(genre: string) {
    switch (genre) {
      case 'Classical':
        if (
          !this.preSessionGenreClassical.playing(
            this.preSessionGenreClassicalId
          )
        ) {
          console.log(genre);
          this.preSessionGenreClassicalId = this.preSessionGenreClassical
            .fade(0, 80, 3000, this.preSessionGenreClassicalId)
            .play();
        }
        break;
      case 'Jazz':
        if (!this.preSessionGenreJazz.playing(this.preSessionGenreJazzId)) {
          console.log(genre);
          this.preSessionGenreJazzId = this.preSessionGenreJazz
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case 'Rock':
        if (!this.preSessionGenreRock.playing(this.preSessionGenreRockId)) {
          console.log(genre);
          this.preSessionGenreRockId = this.preSessionGenreRock
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case 'Dance':
        if (!this.preSessionGenreDance.playing(this.preSessionGenreDanceId)) {
          console.log(genre);
          this.preSessionGenreDanceId = this.preSessionGenreDance
            .fade(0, 80, 3000)
            .play();
        }
        break;
      case 'Surprise Me!':
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

  playFeelingsSelectionPromptSound() {
    if (
      !this.feelingsSelectionPromptSound.playing(
        this.feelingsSelectionPromptSoundId
      )
    ) {
      this.feelingsSelectionPromptSoundId =
        this.feelingsSelectionPromptSound.play();
    }
  }
  playFeelingsSelectionSound() {
    if (!this.feelingsSelectionSound.playing(this.feelingsSelectionSoundId)) {
      this.feelingsSelectionSoundId = this.feelingsSelectionSound.play();
    }
  }
  stopFeelingsSelectionPromptSound() {
    if (
      this.feelingsSelectionPromptSound.playing(
        this.feelingsSelectionPromptSoundId
      )
    ) {
      this.feelingsSelectionPromptSound.stop();
    }
  }
}
