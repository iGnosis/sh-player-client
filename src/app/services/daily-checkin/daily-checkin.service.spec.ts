import { TestBed } from '@angular/core/testing';

import { DailyCheckinService } from './daily-checkin.service';

describe('DailyCheckinService', () => {
  let service: DailyCheckinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyCheckinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
