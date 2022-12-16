import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripeService } from 'ngx-stripe';
import { NGX_STRIPE_VERSION } from 'ngx-stripe/lib/interfaces/ngx-stripe.interface';

import { AddPaymentMethodComponent } from './add-payment-method.component';

describe('AddPaymentMethodComponent', () => {
  let component: AddPaymentMethodComponent;
  let fixture: ComponentFixture<AddPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPaymentMethodComponent],
      providers: [StripeService, { provide: NGX_STRIPE_VERSION }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
