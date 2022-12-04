import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  constructor(
    private dailyCheckinService: DailyCheckinService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.dailyCheckinService.isCheckedInToday().then((isCheckedInToday: boolean) => {
      if (!isCheckedInToday) {
        this.router.navigate(["app", "checkin"]);
      }
    })
  }

}
