import { TestBed } from '@angular/core/testing';

import { UpdateHeadersInterceptor } from './update-headers.interceptor';

describe('UpdateHeadersInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UpdateHeadersInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UpdateHeadersInterceptor = TestBed.inject(UpdateHeadersInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
