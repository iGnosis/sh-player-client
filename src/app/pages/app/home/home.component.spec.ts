import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { GoalsService } from 'src/app/services/goals/goals.service';

describe('HomeComponent', () => {
  let router: Router;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockGoalsService = jasmine.createSpyObj('GoalsService', ['getMonthlyGoals']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ HomeComponent ],
      providers: [
        { provide: GoalsService, useValue: mockGoalsService },
      ],
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    mockGoalsService.getMonthlyGoals.and.returnValue(new Promise((resolve) => resolve({
        "daysCompleted": 3,
        "rewardsCountDown": [
            5,
            10,
            15
        ]
    })));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show reward card if unlocked', async () => {
    let rewardCard = fixture.debugElement.query(By.css('.reward-card'));
    expect(rewardCard).toBeFalsy();
    await component.displayRewardCard({
      tier: "bronze",
      isViewed: true,
      isUnlocked: true,
      isAccessed: true,
      description: '',
      unlockAtDayCompleted: 0,
      couponCode: '',
    });
    fixture.detectChanges();
    rewardCard = fixture.debugElement.query(By.css('.reward-card'));
    expect(rewardCard).toBeTruthy();
  });

  it('should close reward card if open', async () => {
    await component.displayRewardCard({
      tier: "bronze",
      isViewed: true,
      isUnlocked: true,
      isAccessed: true,
      description: '',
      unlockAtDayCompleted: 0,
      couponCode: '',
    });
    fixture.detectChanges();
    let rewardCard = fixture.debugElement.query(By.css('.reward-card'));
    expect(rewardCard).toBeTruthy();
    component.closeRewardCard();
    fixture.detectChanges();
    rewardCard = fixture.debugElement.query(By.css('.reward-card'));
    expect(rewardCard).toBeFalsy();
  });

  it('should give nth by date', () => {
    expect(component.nth(1)).toBe('st');
    expect(component.nth(2)).toBe('nd');
    expect(component.nth(3)).toBe('rd');
    expect(component.nth(4)).toBe('th');
    expect(component.nth(11)).toBe('th');
    expect(component.nth(21)).toBe('st');
    expect(component.nth(22)).toBe('nd');
    expect(component.nth(23)).toBe('rd');
  });

  it('should start a session', () => {
    spyOn(router, 'navigate').and.stub();
    component.startNewSession();
    expect(router.navigate).toHaveBeenCalledWith(["/app/session/", '']);
  });
});
