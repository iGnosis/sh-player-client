import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from "@angular/animations";
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mood-checkin',
  templateUrl: './mood-checkin.component.html',
  styleUrls: ['./mood-checkin.component.scss'],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translate(-50%, 100vh)" }),
        animate(
          "500ms ease-out",
          style({ transform: "translate(-50%, -50%)" })
        ),
      ]),
      state("slideOut", 
        style({ transform: "translate(-50%, -100vh)" }),
      ),
      transition("* => slideOut", animate('0.5s ease-in')),
    ]),
  ],
})
export class MoodCheckinComponent implements OnInit {
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
  selectedMood?: string;
  slideOut: boolean = false;
  
  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  async selectMood(choice: string) {
    this.selectedMood = choice;
    await this.userService.updateUserMood(choice.toLowerCase());
    setTimeout(() => this.slideOut = true, 500);
    setTimeout(() => this.router.navigate(['/app/home']), 1200);
  }

}
