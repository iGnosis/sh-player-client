import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {
  subscription!: any;
  page: number = 1;
  invoices: any = [];
  amount: number = 30;

  constructor(private graphqlService: GraphqlService) { }

  async ngOnInit(): Promise<void> {
    await this.getSubscriptionDetails();
    await this.getBillingHistory('', '');
  }

  async getSubscriptionDetails() {
    const response = await this.graphqlService.gqlRequest(
      GqlConstants.GET_SUBSCRIPTION_DETAILS,
      {},
      true
    );
    
    if (
      response.getSubscriptionDetails &&
      response.getSubscriptionDetails.subscription
    ) {
      this.subscription = response.getSubscriptionDetails.subscription;

      // setting payable amount based on user's discount (Coupon code)
      if (this.subscription.discount) {
        this.amount -= (30 * this.subscription.discount.coupon.percent_off!) / 100;
      }
    }
  }

  getDateStr(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return `${date.toLocaleDateString('default', {
      month: 'long',
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  async getBillingHistory(endingBefore: string, startingAfter: string) {
    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_BILLING_HISTORY, {
      startingAfter,
      endingBefore,
      limit: 10,
    });
    this.invoices = response.getBillingHistory.invoices;
  }

  async nextPage() {
    if (!this.invoices.length) return;
    await this.getBillingHistory('', this.invoices[this.invoices.length - 1].id);
    this.page++;
  }

  async prevPage() {
    if (this.page === 1 || !this.invoices.length) return;
    await this.getBillingHistory(this.invoices[0].id, '');
    this.page--;
  }

  openInvoice(invoiceUrl: string) {
    window.location.href = invoiceUrl;
  }

}
