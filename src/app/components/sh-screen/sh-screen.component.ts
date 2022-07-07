import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  trigger,
  transition,
  animate,
  style,
  keyframes,
} from "@angular/animations";

@Component({
  selector: "app-sh-screen",
  templateUrl: "./sh-screen.component.html",
  styleUrls: ["./sh-screen.component.scss"],
  animations: [
    trigger("fadeIn", [transition(":enter", [animate("200ms ease-in")])]),
    trigger("slideInForLogo", [
      transition(":enter", [
        animate(
          "1022.09ms 640ms cubic-bezier(0.78, 0.04, 0.26, 1.01)",
          keyframes([
            style({ transform: "translateX(150px)" }),
            style({ transform: "translateX(0)" }),
          ])
        ),
      ]),
    ]),
    trigger("slideInForSH", [
      transition(":enter", [
        animate(
          "1022.09ms 0ms cubic-bezier(0.78, 0.04, 0.26, 1.01)",
          keyframes([
            style({ transform: "translateX(40px)", opacity: "0" }),
            style({ transform: "translateX(0)", opacity: "100" }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ShScreenComponent implements OnInit, AfterViewInit {
  showPointMotionLogo = false;
  showSoundHealthLogo = false;
  showSoundHealth = false;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showPointMotionLogo = true;
    }, 600);

    setTimeout(() => {
      this.showSoundHealthLogo = true;
      setTimeout(() => {
        this.showSoundHealth = true;
      }, 650);
    }, 1800);

    // setTimeout(() => {
    //   this.showSoundHealthLogo = false;
    //   this.showSoundHealth = true;
    // }, 2450);
  }
}
