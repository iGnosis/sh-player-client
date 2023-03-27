import { Component, OnInit } from '@angular/core';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { PaymentMethod } from '@stripe/stripe-js';
import { UserService } from 'src/app/services/user.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { ModalConfig } from 'src/app/types/pointmotion';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  paymentMethod: any;
  edit = false;

  card?: PaymentMethod.Card;
  patientDetails!: {
    id: string;
    email: {
      value: string;
    };
    lastName: {
      value: string;
    };
    firstName: {
      value: string;
    };
    phoneCountryCode: string;
    phoneNumber: {
      value: string
    };
    nickname: string;
  };

  patientForm: FormGroup;
  error: string = '';
  patientFormStatusSubject: BehaviorSubject<string> = new BehaviorSubject<string>('INVALID');

  constructor(
    private gqlService: GraphqlService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.patientForm = new FormGroup({});
    this.route.queryParams.subscribe((params) => {
      this.edit = params['edit'] == 'true';
    });
  }

  async ngOnInit() {
    const patientId = this.userService.get().id;
    const patient = await this.gqlService.gqlRequest(
      GqlConstants.GET_PATIENT_DETAILS,
      {
        user: patientId,
      },
      true
    );
    this.patientDetails = patient.patient_by_pk;

    this.patientForm = new FormGroup({
      id: new FormControl(this.patientDetails.id),
      firstName: new FormControl(this.patientDetails.firstName.value, [Validators.required]),
      lastName: new FormControl(this.patientDetails.lastName.value, [Validators.required]),
      email: new FormControl(this.patientDetails.email.value, [Validators.required, Validators.email]),
      phoneCountryCode: new FormControl(this.patientDetails.phoneCountryCode, [Validators.required]),
      phoneNumber: new FormControl(this.patientDetails.phoneNumber.value, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]),
    });

    this.patientForm.statusChanges.pipe(distinctUntilChanged()).subscribe((status) => {
      this.patientFormStatusSubject.next(status);
    });

    this.patientForm.valueChanges.subscribe((value) => {
      this.userService.patientForm = value;
      this.patientDetails = value;
    });

    try {
      const resp: { getDefaultPaymentMethod: { data: PaymentMethod } } =
        await this.gqlService.gqlRequest(
          GqlConstants.GET_DEFAULT_PAYMENT_METHOD,
          {},
          true
        );

      const { card } = resp.getDefaultPaymentMethod.data;
      if (card) {
        this.card = card;
      }
    } catch (e) {
      this.card = undefined;
    }
  }
}
