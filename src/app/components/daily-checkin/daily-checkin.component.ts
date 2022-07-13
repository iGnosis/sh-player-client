import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from "@angular/animations";
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';

@Component({
  selector: 'app-mood-checkin',
  templateUrl: './daily-checkin.component.html',
  styleUrls: ['./daily-checkin.component.scss'],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translate(-50%, 100vh)" }),
        animate(
          "500ms ease-out",
          style({ transform: "translate(-50%, -50%)" })
        ),
      ]),
      state("slideIn", 
        style({ transform: "translate(-50%, 100vh)" }),
      ),
      state("open", 
        style({ transform: "translate(-50%, -50%)" }),
      ),
      state("slideOut", 
        style({ transform: "translate(-50%, -100vh)" }),
      ),
      transition("* => open", animate("0.5s ease-in")),
      transition("* => slideOut", animate('0.5s ease-in')),
    ]),
  ],
})
export class DailyCheckinComponent implements OnInit {
  options: AnimationOptions = {    
    path: '/assets/images/animations/wave.json',  
  };  
  moodList = [
    {
      title: 'Irritated',
      img: '/assets/images/moods/irritated.jpg',
      color: '#EB0000',
    },
    {
      title: 'Anxious',
      img: '/assets/images/moods/anxious.jpg',
      color: '#F26161',
    },
    {
      title: 'Okay',
      img: '/assets/images/moods/okay.jpg',
      color: '#FFC440',
    },
    {
      title: 'Happy',
      img: '/assets/images/moods/happy.jpg',
      color: '#62D989',
    },
    {
      title: 'Daring',
      img: '/assets/images/moods/daring.jpg',
      color: '#00BD3E',
    },
  ];
  genreList = [
    {
      title: 'classical',
      img: '/assets/images/genres/Treble.jpg',
    },
    {
      title: 'rock',
      img: '/assets/images/genres/Rock.jpg',
    },
    {
      title: 'jazz',
      img: '/assets/images/genres/Sax.jpg',
    },
    {
      title: 'dance',
      img: '/assets/images/genres/Dancing.jpg',
    },
    {
      title: 'surprise me',
      img: '/assets/images/genres/Gift.jpg',
    },
  ];
  selectedMood?: string;
  selectedGenre?: string;
  moodSlideOut: boolean = false;
  showGenreCard: boolean = false;
  genreSlideOut: boolean = false;
  
  constructor(
    private router: Router,
    private dailyCheckinService: DailyCheckinService,
  ) { }

  ngOnInit(): void {
  }

  async selectMood(choice: string) {
    this.selectedMood = choice;
    await this.dailyCheckinService.dailyCheckin("mood", choice.toLowerCase());
    setTimeout(() => this.moodSlideOut = true, 500);
    setTimeout(() => this.showGenreCard = true, 1200);
  }

  async selectGenre(choice: string) {
    this.selectedGenre = choice;
    await this.dailyCheckinService.dailyCheckin("genre", choice.toLowerCase());
    setTimeout(() => this.genreSlideOut = true, 500);
    setTimeout(() => {
      this.showGenreCard = false;
      this.router.navigate(['/app/home'])
    }, 1200);
  }

}
