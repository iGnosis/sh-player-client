import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeElements } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { AuthService } from 'src/app/services/auth.service';
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
  isSignup: boolean = false;
  promoCode!: string;

  constructor(
    private gqlService: GraphqlService,
    private stripeService: StripeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.isSignup =
      Boolean(this.route.snapshot.paramMap.get('signup')) || false;
  }

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
            // setting the current paymentMethod as default paymentMethod for subscription.
            await this.setDefaultPaymentMethod(res);
            await this.createSubscriptionAndRedirect();
          }
        }
      });
  }

  async setDefaultPaymentMethod(result: any) {
    const paymentMethodId = result.setupIntent.payment_method;
    try {
      await this.gqlService.client.request(
        GqlConstants.SET_DEFAULT_PAYMENT_METHOD,
        {
          paymentMethodId,
        }
      );
    } catch (err) {
      console.log('Error::', err);
    }
  }

  async createSubscriptionAndRedirect() {
    try {
      const res = await this.authService.getSubscriptionDetails();
      if (res?.data?.getSubscriptionDetails?.subscriptionId) {
        return;
      } else {
        throw new Error('Subscription does not exist');
      }
    } catch (err) {
      await this.gqlService.client.request(GqlConstants.CREATE_SUBSCRIPTION);
    } finally {
      const continueSignup = this.isSignup === true;
      if (continueSignup) {
        this.router.navigate(['/app/signup/finish']);
      } else {
        this.router.navigate(['/app/home'], {
          queryParams: { paymentAdded: true },
        });
      }
    }
  }

  async subscribeWithPromoCodeAndRedirect() {
    try {
      const res = await this.authService.getSubscriptionDetails();
      if (res?.data?.getSubscriptionDetails?.subscriptionId) {
        return;
      } else {
        throw new Error('Subscription does not exist');
      }
    } catch (err) {
      console.log('promocode::', this.promoCode.toUpperCase());
      this.gqlService.client
        .request(GqlConstants.CREATE_SUBSCRIPTION_WITH_PROMOCODE, {
          promocode: this.promoCode.toUpperCase(),
        })
        .then(() => {
          console.log('Success::', 'Subscription created');
          const continueSignup = this.isSignup === true;
          if (continueSignup) {
            this.router.navigate(['/app/signup/finish']);
          } else {
            this.router.navigate(['/app/home'], {
              queryParams: { paymentAdded: true },
            });
          }
        })
        .catch((err) => {
          console.log('Error::', err);
        });
    }
  }
}
