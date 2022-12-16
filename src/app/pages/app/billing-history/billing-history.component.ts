import { Component, OnInit } from '@angular/core';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {
  page: number = 1;
  invoices: any = [];

  constructor(private graphqlService: GraphqlService) { }

  async ngOnInit(): Promise<void> {
    await this.getBillingHistory('', '');
  }

  async getBillingHistory(endingBefore: string, startingAfter: string) {
    const response = await this.graphqlService.gqlRequest(GqlConstants.GET_BILLING_HISTORY, {
      startingAfter,
      endingBefore,
      limit: 10,
    });
    this.invoices = response.getBillingHistory.invoices;
    console.log('billing history', response);
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

}
