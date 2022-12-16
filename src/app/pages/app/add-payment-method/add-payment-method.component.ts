import { Component, OnInit } from '@angular/core';
import { StripeElements } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss'],
})
export class AddPaymentMethodComponent implements OnInit {
  elements!: StripeElements;
  clientSecret!: string;
  constructor(
    private gqlService: GraphqlService,
    private stripeService: StripeService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!window.Stripe) return;
    this.clientSecret = await this.getClientSecret();
    this.stripeService
      .elements({
        locale: 'en',
        clientSecret: this.clientSecret,
        appearance: {
          theme: 'flat',
        },
        loader: 'always',
      })
      .subscribe((elements) => {
        this.elements = elements;

        const paymentElement = elements.create('payment', {
          layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: true,
          },
        });
        paymentElement.mount('#payment-element');
      });
  }

  async getClientSecret(): Promise<string> {
    try {
      const response: { createPaymentSetupIntent: { clientSecret: string } } =
        await this.gqlService.client.request(
          GqlConstants.GET_PAYMENT_CLIENT_SECRET
        );
      return response.createPaymentSetupIntent.clientSecret;
    } catch (err) {
      throw new Error('Unable to get client_secret');
    }
  }

  submit() {
    this.stripeService
      .confirmSetup({
        elements: this.elements,
        confirmParams: {
          return_url: 'http://localhost:4000',
        },
        redirect: 'if_required',
      })
      .subscribe(async (res) => {
        if (res.error) {
          console.log('Error::', res.error);
        } else {
          // The payment has been processed!
          if (res.setupIntent?.status === 'succeeded') {
            console.log('payment::method:', res.setupIntent.status);

            // setting the current paymentMethod as default paymentMethod for subscription.
            const paymentMethodId = res.setupIntent.payment_method;
            try {
              await this.gqlService.client.request(
                GqlConstants.SET_DEFAULT_PAYMENT_METHOD,
                {
                  paymentMethodId,
                }
              );

              const subscribe = await this.gqlService.client.request(
                GqlConstants.CREATE_SUBSCRIPTION
              );
              console.log('subscription::created::successfully');
            } catch (err) {
              console.log('Error::', err);
            }
          }
        }
      });
  }
}
