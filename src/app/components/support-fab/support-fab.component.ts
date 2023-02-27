import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-fab',
  templateUrl: './support-fab.component.html',
  styleUrls: ['./support-fab.component.scss']
})
export class SupportFabComponent implements OnInit {
  fab = false;
  redirectUrl = environment.playerClientUrl;
  constructor() {}

  ngOnInit(): void { }

  toggleFab() {
    this.fab = !this.fab;
  }

}
