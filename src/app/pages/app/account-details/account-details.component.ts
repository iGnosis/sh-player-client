import { Component, OnInit } from '@angular/core';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { PaymentMethod } from '@stripe/stripe-js';
import { UserService } from 'src/app/services/user.service';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
@Component({
  selector: 'account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  paymentMethod: any;
  constructor(
    private gqlService: GraphqlService,
    private userService: UserService
  ) {}

  card!: PaymentMethod.Card;
  patientDetails!: {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    phoneCountryCode: string;
    phoneNumber: string;
  };

  subscription!: any;
  subscriptionStatus!: string;

  isSubscribed = false;

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
    await this.setLocalSubscriptionStatus(card);

    const response = await this.gqlService.gqlRequest(
      GqlConstants.GET_SUBSCRIPTION_DETAILS,
      {},
      true
    );
    if (
      response.getSubscriptionDetails &&
      response.getSubscriptionDetails.subscription
    ) {
      this.subscription = response.getSubscriptionDetails.subscription;
    }
    console.log(this.subscription);
  }

  async setLocalSubscriptionStatus(card?: PaymentMethod.Card) {
    const subscription = await this.gqlService.gqlRequest(
      GqlConstants.GET_SUBSCRIPTION_STATUS,
      {},
      true
    );
    const subscriptionStatus = subscription.getSubscriptionStatus.data;
    this.subscriptionStatus = subscriptionStatus;
    console.log('subscriptionStatus::', subscriptionStatus);
    if (subscriptionStatus === 'cancelled') {
      this.isSubscribed = false;
    } else if (subscriptionStatus === 'active') {
      this.isSubscribed = true;
    } else if (subscriptionStatus === 'trial_period') {
      if (!card) {
        // ask the user to add payment method.
      } else {
        this.isSubscribed = true;
      }
    } else if (subscriptionStatus === 'trial_expired') {
      this.isSubscribed = false;
      // ask the user to add payment method and subscribe
    } else {
      // handle this case
      this.isSubscribed = false;
    }
  }

  async cancelSubscription() {
    const resp = await this.gqlService.gqlRequest(
      GqlConstants.CANCEL_SUBSCRIPTION,
      {},
      true
    );
    this.subscription = resp.cancelSubscription.subscription;
    this.setLocalSubscriptionStatus();
  }

  async subscribe() {
    const subscription = await this.gqlService.gqlRequest(
      GqlConstants.CREATE_SUBSCRIPTION,
      {},
      true
    );
    this.subscription = subscription.createSubscription.subscription;
    this.setLocalSubscriptionStatus();
  }

  getDateStr(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return `${date.toLocaleDateString('default', {
      month: 'long',
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
