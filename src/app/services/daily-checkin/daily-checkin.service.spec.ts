import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DailyCheckinService } from './daily-checkin.service';

describe('DailyCheckinService', () => {
  let service: DailyCheckinService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(DailyCheckinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
