import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  activeTab!: string;
  constructor(private route:Router) { }

  ngOnInit(): void {
    this.activeTab = this.route.url.split('/').slice(-1)[0];    
    console.log(this.activeTab === 'goals');
    
  }

}
