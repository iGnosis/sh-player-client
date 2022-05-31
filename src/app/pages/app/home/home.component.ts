import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CareplanService } from "src/app/services/careplan/careplan.service";
import { SessionService } from "src/app/services/session/session.service";
import { Patient } from "src/app/types/patient";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  user!: Patient;
  careplanId!: string;
  sessionId!: string;
  constructor(
    private careplanService: CareplanService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit(): void {}

  async startNewSession() {
    const activeCareplans = await this.careplanService.getActiveCareplans(
      this.user.id
    );
    // for now! If a careplan exists we can start a session with the first careplan ID.
    if (activeCareplans.patient.length > 0) {
      this.careplanId =
        activeCareplans.patient[0].patient_careplans[0].careplanByCareplan.id;
      this.sessionId = (await this.sessionService.createNewSession(
        this.user.id,
        this.careplanId
      )) as string;
      this.router.navigate(["/app/session/", this.sessionId]);
    }
  }
}
