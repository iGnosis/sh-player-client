import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from './services/jwt.service';
import { SocketService } from './services/socket/socket.service';
import { ThemeService } from './services/theme/theme.service';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'patient-provider';
  timer: any;
  user?: any;

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private themeService: ThemeService,
    private socketService: SocketService,
  ) {
    this.themeService.setTheme();
    this.overrideConsole();
  }

  overrideConsole() {
    let originalConsoleLog = console.log;
    let originalConsoleError = console.error;
    let originalConsoleWarn = console.warn;
    console.log = (...args) => {
      this.socketService.sendLogsToServer((JSON.stringify(args).toLowerCase().includes('error') ? '[ERROR] ' : '[LOG] ') + JSON.stringify(args));
      originalConsoleLog.apply(console, args);
    }
    console.error = (...args) => {
      this.socketService.sendLogsToServer('[ERROR] ' + JSON.stringify(args));
      originalConsoleError.apply(console, args);
    }
    console.warn = (...args) => {
      this.socketService.sendLogsToServer('[WARN] ' + JSON.stringify(args));
      originalConsoleWarn.apply(console, args);
    }
  }

  async ngOnInit() {
    if (!this.jwtService.isAuthenticated()) {
      console.log('token not found or it is expired.');
    }
    else {
      // printing accessToken for easier debugging.
      console.log('accessToken:', this.jwtService.getToken());
      this.userService.appAccessed();
      this.router.events.subscribe((val: any) => {
        if (val.urlAfterRedirects && val.urlAfterRedirects === '/public/start') {
          clearTimeout(this.timer);
        }
      })
    }
  }
}
