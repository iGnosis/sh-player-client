import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodCheckinComponent } from './daily-checkin.component';

describe('MoodCheckinComponent', () => {
  let component: MoodCheckinComponent;
  let fixture: ComponentFixture<MoodCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoodCheckinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
