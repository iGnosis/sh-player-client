import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics/google-analytics.service';

import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let router: Router;
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', ['setPreferredGenres', 'setPreferredActivities', 'setPatientDetails']);
  mockAuthService.setPatientDetails.and.returnValue(new Promise((resolve, reject) => resolve({
    response: {},
  })));
  mockAuthService.setPreferredActivities.and.returnValue(new Promise((resolve, reject) => resolve({
    response: {},
  })));
  mockAuthService.setPreferredGenres.and.returnValue(new Promise((resolve, reject) => resolve({
    response: {},
  })));
  let mockGAService = jasmine.createSpyObj('GoogleAnalyticsService', ['sendEvent']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ SignupComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GoogleAnalyticsService, useValue: mockGAService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show or hide password', () => {
    component.showPassword = false;

    component.toggleShowPassword()
    expect(component.showPassword).toBeTruthy();

    component.toggleShowPassword()
    expect(component.showPassword).toBeFalsy();
  });

  it('should signup', async () => {
    component.signupStep = 2;
    component.email = 'john@example.com';

    const spy = spyOn(router, 'navigate').and.stub();
    await component.nextSignupStep();
    component.signupStep = 3;
    await component.nextSignupStep();
    component.signupStep = 4;
    await component.nextSignupStep();


    expect(mockAuthService.setPatientDetails).toHaveBeenCalled();
    expect(spy.calls.allArgs()).toEqual([[['/app/signup/3']], [['/app/signup/4']], [['app/signup/5/1']]]);
  });

  it('should go to next interest step', async () => {
    component.interestStep = 1;

    const spy = spyOn(router, 'navigate').and.stub();
    component.selectInterest(0);
    await component.nextInterestStep();
    component.interestStep = 2;
    component.selectActivity(0);
    await component.nextInterestStep();
    component.interestStep = 3;
    await component.nextInterestStep();

    expect(spy.calls.allArgs()).toEqual([[['app/signup/3/2']], [['app/signup/3/3']], [['/app/home']]]);
  });

  it('should check password strength', () => {
    expect(component.checkPasswordStrength('abc')).toBe('Weak');
    expect(component.checkPasswordStrength('abc123')).toBe('Fair');
    expect(component.checkPasswordStrength('abc1234567')).toBe("Good");
    expect(component.checkPasswordStrength('abc1234567890123')).toBe("Strong");
  });

  it('should go to home if signup completed', () => {
    component.signupStep = 4;

    spyOn(router, 'navigate').and.stub();
    component.goToHome();

    expect(router.navigate).toHaveBeenCalledWith(['/app/home']);
  });

  it('should go back one step', () => {
    component.signupStep = 4;

    const spy = spyOn(router, 'navigate').and.stub();
    component.goBack();

    component.interestStep = 2;
    component.goBackInterest();

    expect(spy.calls.allArgs()).toEqual([[['/app/signup/3']], [['app/signup/3/1']]]);
  });

  it('should select a preferred interest', () => {
    component.interestStep = 1;

    component.selectInterest(0);

    expect(component.interests[0].selected).toBe(true);
  });

  it('should select a preferred activity', () => {
    component.interestStep = 2;

    component.selectActivity(0);

    expect(component.activities[0].selected).toBe(true);
  });

  it('should show next button when 3 interests are selected', () => {
    component.interestStep = 1;

    expect(component.showNext()).toBeFalsy();

    component.selectInterest(0);
    component.selectInterest(1);
    component.selectInterest(2);

    expect(component.showNext()).toBeTruthy();

    component.interestStep = 2;

    expect(component.showNext()).toBeFalsy();

    component.selectActivity(0);
    component.selectActivity(1);
    component.selectActivity(2);

    expect(component.showNext()).toBeTruthy();
  });

  it('should show next button when a reminder time is selected', () => {
    component.interestStep = 3;

    expect(component.showNext()).toBeFalsy();

    component.reminderTimes['Morning'] = true;

    expect(component.showNext()).toBeTruthy();
  });
});
