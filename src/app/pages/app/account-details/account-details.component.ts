import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { UserService } from 'src/app/services/user.service';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
@Component({
  selector: 'account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  tabs = <const>['general', 'subscription'];
  disableSaveBtn?: boolean;
  componentRef?: any;

  constructor(private router: Router, private userService: UserService) {}

  editBtnState(): 'edit' | 'save' | '' {
    const currentUrl = this.router.url;
    if (currentUrl.includes('edit=true')) {
      return 'save';
    } else if (currentUrl.includes('general')) {
      return 'edit';
    } else {
      return '';
    }
  }

  onActivate(componentRef: any) {
    if (componentRef instanceof GeneralSettingsComponent) {
      componentRef.patientFormStatusSubject.subscribe((status) => {
        this.disableSaveBtn = status === 'INVALID';
      });
    }
  }

  async save() {
    const resp = await this.userService.savePatientFormDetails();
    if (resp.id) {
      this.router.navigate(['/app/account-details/general']);
    }
  }

  async ngOnInit() {}
}
