import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  trigger,
  transition,
  animate,
  style,
  state,
} from "@angular/animations";
import { AnimationOptions } from "ngx-lottie";
import { Router } from "@angular/router";
import { DailyCheckinService } from "src/app/services/daily-checkin/daily-checkin.service";
import { Howler } from "howler";
import { SoundsService } from "src/app/services/sounds/sounds.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-mood-checkin",
  templateUrl: "./daily-checkin.component.html",
  styleUrls: ["./daily-checkin.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translate(-50%, 100vh)" }),
        animate(
          "500ms ease-out",
          style({ transform: "translate(-50%, -50%)" })
        ),
      ]),
      state("slideIn", style({ transform: "translate(-50%, 100vh)" })),
      state("open", style({ transform: "translate(-50%, -50%)" })),
      state("slideOut", style({ transform: "translate(-50%, -100vh)" })),
      transition("* => open", animate("0.5s ease-in")),
      transition("* => slideOut", animate("0.5s ease-in")),
    ]),
  ],
})
export class DailyCheckinComponent implements OnInit, AfterViewInit {
  options: AnimationOptions = {
    path: "/assets/images/animations/wave.json",
  };
  moodList = [
    {
      title: "Irritated",
      img: "/assets/images/moods/irritated.jpg",
    },
    {
      title: "Anxious",
      img: "/assets/images/moods/anxious.jpg",
    },
    {
      title: "Okay",
      img: "/assets/images/moods/okay.jpg",
    },
    {
      title: "Happy",
      img: "/assets/images/moods/happy.jpg",
    },
    {
      title: "Daring",
      img: "/assets/images/moods/daring.jpg",
    },
  ];
  genreList = [
    {
      title: "Classical",
      img: "/assets/images/genres/Treble.jpg",
    },
    {
      title: "Rock",
      img: "/assets/images/genres/Rock.jpg",
    },
    {
      title: "Jazz",
      img: "/assets/images/genres/Sax.jpg",
    },
    {
      title: "Dance",
      img: "/assets/images/genres/Dancing.jpg",
    },
    {
      title: "Surprise Me!",
      img: "/assets/images/genres/Gift.jpg",
    },
  ];
  selectedMood?: string;
  selectedGenre?: string;
  moodSlideOut: boolean = false;
  showGenreCard: boolean = false;
  genreSlideOut: boolean = false;
  debouncedPlayMusic: (...args: any[]) => void;
  playState: "play" | "stop" | undefined = undefined;
  timer: any;

  constructor(
    private router: Router,
    private dailyCheckinService: DailyCheckinService,
    private soundsService: SoundsService,
    private userService: UserService
  ) {

    if (environment.name === 'dev' || environment.name === 'local') {
      this.genreList.push({
        title: 'Afro',
        img: '/assets/images/genres/Dancing.jpg',
      });
    }

    this.debouncedPlayMusic = this.debounce((genre: string) => {
      this.playMusic(genre);
    }, 300);
  }
  ngAfterViewInit(): void {
    this.soundsService.playFeelingsSelectionPromptSound();
  }

  ngOnInit(): void {}

  async selectMood(choice: string) {
    this.selectedMood = choice;
    this.soundsService.playFeelingsSelectionSound();
    this.soundsService.stopFeelingsSelectionPromptSound();
    await this.dailyCheckinService.dailyCheckin("mood", choice.toLowerCase());
    setTimeout(() => (this.moodSlideOut = true), 500);
    setTimeout(() => (this.showGenreCard = true), 1200);
  }

  async selectGenre(choice: string) {
    this.selectedGenre = choice;
    await this.dailyCheckinService.dailyCheckin("genre", choice.toLowerCase());
    setTimeout(() => (this.genreSlideOut = true), 500);
    setTimeout(async () => {
      this.showGenreCard = false;
      const step = await this.userService.isOnboarded();

      Howler.stop();
      if (step == 'finish') {
        this.router.navigate(["app", "home"]);
      } else {
        this.router.navigate(["/app/signup/setup"]);
      }
    }, 1200);
  }

  playMusic(genre: string) {
    this.playState = "play";
    console.log("play ", genre);
    this.soundsService.playGenreSound(genre);
  }

  stopMusic(genre?: string) {
    if (genre) clearTimeout(this.timer);
    this.playState = "stop";
    Howler.stop();
  }

  debounce(func: any, timeout = 300) {
    return (...args: any[]) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
}
