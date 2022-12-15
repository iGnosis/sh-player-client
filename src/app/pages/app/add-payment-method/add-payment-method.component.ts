import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    if (!window.Stripe) return;

    const clientSecret = await this.getClientSecret();
    const stripe = window.Stripe('{{publishable_key}}', {
      stripeAccount: '{{account_id}}'
    });
    const elements = stripe.elements({ locale: 'en', clientSecret, appearance: {
      theme: 'stripe',
    }});

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
  }

  async getClientSecret() {
    const response: any = await fetch("https://api.stripe.com/v1/setup_intents", {
      body: "payment_method_types[]=card",
      headers: {
        Authorization: "Bearer  {{secret}}",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const { client_secret } = await response.json();
    return client_secret;
  }

  submit() {

  }

}
