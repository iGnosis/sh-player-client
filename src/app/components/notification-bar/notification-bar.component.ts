import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {
  daysLeft: number;
  show = false;

  constructor() {
    this.daysLeft = 6;
  }

  ngOnInit(): void {
  }

}
