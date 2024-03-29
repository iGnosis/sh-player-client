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
  let mockGoalsService = jasmine.createSpyObj('GoalsService', ['getMonthlyGoals', 'getDailyGoals']);

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
    mockGoalsService.getDailyGoals.and.returnValue(new Promise((resolve) => resolve([
      {
          "name": "Sit Stand Achieve",
          "isCompleted": false
      },
      {
          "name": "Beat Boxer",
          "isCompleted": false
      },
      {
          "name": "Sound Explorer",
          "isCompleted": false
      }
  ])));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show reward card if unlocked', (done) => {
    let rewardCard = fixture.debugElement.query(By.css('.reward-card'));

    expect(rewardCard).toBeFalsy();

    component.displayRewardCard({
      tier: "bronze",
      isViewed: true,
      isUnlocked: true,
      isAccessed: true,
      description: '',
      unlockAtDayCompleted: 0,
      couponCode: '',
    }).then(() => {
      fixture.detectChanges();
      rewardCard = fixture.debugElement.query(By.css('.reward-card'));
  
      expect(rewardCard).toBeTruthy();
      done();
    });
  });

  it('should close reward card if open', (done) => {
    component.displayRewardCard({
      tier: "bronze",
      isViewed: true,
      isUnlocked: true,
      isAccessed: true,
      description: '',
      unlockAtDayCompleted: 0,
      couponCode: '',
    }).then(() => {
      fixture.detectChanges();
      let rewardCard = fixture.debugElement.query(By.css('.reward-card'));
  
      expect(rewardCard).toBeTruthy();
  
      component.closeRewardCard();
  
      fixture.detectChanges();
      rewardCard = fixture.debugElement.query(By.css('.reward-card'));
  
      expect(rewardCard).toBeFalsy();
      done();
    });
  });

  it('should give next session', () => {
    component.sessions = [
        {
            "name": "Sit Stand Achieve",
            "status": 0
        },
        {
            "name": "Beat Boxer",
            "status": 0
        },
        {
            "name": "Sound Explorer",
            "status": 0
        }
    ];
    component.getNextSession();
    expect(component.sessions.map((session: any) => session.name).includes(component.nextSession.name)).toBeTruthy();
  });

  it('should give background name', () => {
    expect(component.getBackgroundName('')).toBe('');
    expect(component.getBackgroundName('Sit Stand Achieve')).toBe('sit-stand-achieve');
    expect(component.getBackgroundName('Beat Boxer')).toBe('beat-boxer');
    expect(component.getBackgroundName('Sound Explorer')).toBe('sound-explorer');
  });

  it('should start a session', async () => {
    component.sessions = [
        {
            "name": "Sit Stand Achieve",
            "status": 0
        },
        {
            "name": "Beat Boxer",
            "status": 0
        },
        {
            "name": "Sound Explorer",
            "status": 0
        }
    ];
    spyOn(router, 'navigate').and.stub();
    component.getNextSession();
    await component.startNewSession();
    expect(router.navigate).toHaveBeenCalledWith(["/app/session/", { game: component.nextSession.name.replace(/\s/g, "_").toLowerCase() }]);
  });
});
