import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRewardModalComponent } from './share-reward-modal.component';

describe('ShareRewardModalComponent', () => {
  let component: ShareRewardModalComponent;
  let fixture: ComponentFixture<ShareRewardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRewardModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRewardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
