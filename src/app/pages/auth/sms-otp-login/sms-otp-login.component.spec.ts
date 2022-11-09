import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UserService } from 'src/app/services/user.service';
import { SmsOtpLoginComponent } from './sms-otp-login.component';

describe('SmsOtpLoginComponent', () => {
  let router: Router;
  let component: SmsOtpLoginComponent;
  let fixture: ComponentFixture<SmsOtpLoginComponent>;
  let mockDailyCheckinService = jasmine.createSpyObj('DailyCheckinService', ['setPreferredGenres', 'setPreferredActivities', 'setPatientDetails', 'getLastCheckin']);
  let mockGraphqlService = jasmine.createSpyObj('GraphqlService', ['gqlRequest']);
  let mockUserService = jasmine.createSpyObj('UserService', ['isOnboarded', 'set']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ SmsOtpLoginComponent ],
      providers: [
        { provide: DailyCheckinService, useValue: mockDailyCheckinService },
        { provide: GraphqlService, useValue: mockGraphqlService },
        { provide: UserService, useValue: mockUserService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsOtpLoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockUserService.set.and.returnValue();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form', () => {
    component.formErrorMsg = 'error';
    component.step = 1;
    component.phoneNumber = '1234567890';
    component.otpCode = '123456';

    component.resetForm();

    expect(component.step).toBeFalsy();
    expect(component.phoneNumber).toBeFalsy();
    expect(component.otpCode).toBeFalsy();
    expect(component.formErrorMsg).toBeFalsy();
    expect(component.tempFullPhoneNumber).toBeFalsy();
    expect(component.fullPhoneNumber).toBeFalsy();
  });

  // it('should decode jwt if valid', () => {
  //   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiNDRlMGY3LTNhYzUtNDllZi04NWM4LTYzYWIxNGQ4YWQ3NyIsImlhdCI6MTY2MzE0MzM0OCwiZXhwIjoxNjYzMjI5NzQ4LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicGF0aWVudCIsInRoZXJhcGlzdCIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InBhdGllbnQiLCJ4LWhhc3VyYS11c2VyLWlkIjoiNGI0NGUwZjctM2FjNS00OWVmLTg1YzgtNjNhYjE0ZDhhZDc3IiwieC1oYXN1cmEtY2FyZXBsYW4taWQiOiI0MzE5MDIzYS1hMjRiLTRkMTktYWY4Mi1iZTkyZDE0ZjA5ZGUifX0.Ipb4g_Z45r2ukT5Xu0f1SchkpMYAHRx8eQHeLt78J_Q';
  //   const result = jwtService.decodeJwt(token);
  //   expect(result.id).not.toEqual(undefined);
  // });

  it('should send login otp', fakeAsync(() => {
    component.step = 0;
    let event = {
      target: {
        countryCode: { value: '+91' },
        phoneNumber: { value: '9899898989' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      requestLoginOtp: {
        data: {
          message: 'success',
        }
      },
    })));

    component.submit(event);
    tick();

    expect(component.step).toBe(1);
    discardPeriodicTasks()
  }));

  it('should send signup otp', fakeAsync(() => {
    component.step = 0;
    component.tempFullPhoneNumber = '+919899898989';
    let event = {
      target: {
        countryCode: { value: '+91' },
        phoneNumber: { value: '9899898989' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      resendLoginOtp: {
        data: {
          message: 'success',
        }
      },
    })));

    component.submit(event);
    tick();

    expect(component.step).toBe(1);
    discardPeriodicTasks();
  }));

  it('should not send otp if request failed', fakeAsync(() => {
    component.step = 0;
    let event = {
      target: {
        countryCode: { value: '+91' },
        phoneNumber: { value: '9899898989' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      requestLoginOtp: {
        data: {}
      },
    })));

    component.submit(event);
    tick(7000);

    expect(component.step).toBe(0);
    flush();
  }));

  it('should not send otp if phone number is invalid ', fakeAsync(() => {
    component.step = 0;
    let event = {
      target: {
        countryCode: { value: '91' },
        phoneNumber: { value: '989989898923' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      requestLoginOtp: {
        data: {
          message: 'success',
        }
      },
    })));

    component.submit(event);
    tick();

    expect(component.step).toBe(0);
    flush();
  }));

  it('should not send signup otp if request failed', fakeAsync(() => {
    component.step = 0;
    component.tempFullPhoneNumber = '+919899898989';
    let event = {
      target: {
        countryCode: { value: '+91' },
        phoneNumber: { value: '9899898989' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({})));

    component.submit(event);
    tick(7000);

    expect(component.step).toBe(0);
    flush();
  }));

  it('should verify otp and go to home/signup if user has already checked in today', fakeAsync(() => {
    component.step = 1;
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn<SmsOtpLoginComponent, any>(component, 'submit');
    let event = {
      target: {
        otpCode: { value: '234556' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      verifyLoginOtp: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiNDRlMGY3LTNhYzUtNDllZi04NWM4LTYzYWIxNGQ4YWQ3NyIsImlhdCI6MTY2MzE0MzM0OCwiZXhwIjoxNjYzMjI5NzQ4LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicGF0aWVudCIsInRoZXJhcGlzdCIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InBhdGllbnQiLCJ4LWhhc3VyYS11c2VyLWlkIjoiNGI0NGUwZjctM2FjNS00OWVmLTg1YzgtNjNhYjE0ZDhhZDc3IiwieC1oYXN1cmEtY2FyZXBsYW4taWQiOiI0MzE5MDIzYS1hMjRiLTRkMTktYWY4Mi1iZTkyZDE0ZjA5ZGUifX0.Ipb4g_Z45r2ukT5Xu0f1SchkpMYAHRx8eQHeLt78J_Q',
        }
      },
    })));
    mockDailyCheckinService.getLastCheckin.and.returnValue(new Promise((resolve, reject) => resolve({
      checkin: [
        { createdAt: new Date() },
      ]
    })));
    spy.and.returnValue({
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": 'abc',
      }
    })

    component.submit(event);
    tick(7000);

    expect(router.navigate).not.toHaveBeenCalledWith(["app", "checkin"]);
    flush();
  }));

  xit('should verify otp and go do checkin if not done already on that day', fakeAsync(() => {
    component.step = 1;
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn<SmsOtpLoginComponent, any>(component, 'submit');
    let event = {
      target: {
        otpCode: { value: '234556' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      verifyLoginOtp: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiNDRlMGY3LTNhYzUtNDllZi04NWM4LTYzYWIxNGQ4YWQ3NyIsImlhdCI6MTY2MzE0MzM0OCwiZXhwIjoxNjYzMjI5NzQ4LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicGF0aWVudCIsInRoZXJhcGlzdCIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InBhdGllbnQiLCJ4LWhhc3VyYS11c2VyLWlkIjoiNGI0NGUwZjctM2FjNS00OWVmLTg1YzgtNjNhYjE0ZDhhZDc3IiwieC1oYXN1cmEtY2FyZXBsYW4taWQiOiI0MzE5MDIzYS1hMjRiLTRkMTktYWY4Mi1iZTkyZDE0ZjA5ZGUifX0.Ipb4g_Z45r2ukT5Xu0f1SchkpMYAHRx8eQHeLt78J_Q',
        }
      },
    })));
    mockDailyCheckinService.getLastCheckin.and.returnValue(new Promise((resolve, reject) => resolve({
      checkin: []
    })));
    spy.and.returnValue({
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": 'abc',
      }
    })

    component.submit(event);
    tick(7000);

    expect(router.navigate).toHaveBeenCalledWith(["app", "checkin"]);
    flush();
  }));

  xit('should verify otp and finish signup if not completed', fakeAsync(() => {
    component.step = 1;
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn<SmsOtpLoginComponent, any>(component, 'submit');
    let event = {
      target: {
        otpCode: { value: '234556' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      verifyLoginOtp: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiNDRlMGY3LTNhYzUtNDllZi04NWM4LTYzYWIxNGQ4YWQ3NyIsImlhdCI6MTY2MzE0MzM0OCwiZXhwIjoxNjYzMjI5NzQ4LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicGF0aWVudCIsInRoZXJhcGlzdCIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InBhdGllbnQiLCJ4LWhhc3VyYS11c2VyLWlkIjoiNGI0NGUwZjctM2FjNS00OWVmLTg1YzgtNjNhYjE0ZDhhZDc3IiwieC1oYXN1cmEtY2FyZXBsYW4taWQiOiI0MzE5MDIzYS1hMjRiLTRkMTktYWY4Mi1iZTkyZDE0ZjA5ZGUifX0.Ipb4g_Z45r2ukT5Xu0f1SchkpMYAHRx8eQHeLt78J_Q',
        }
      },
    })));
    mockDailyCheckinService.getLastCheckin.and.returnValue(new Promise((resolve, reject) => resolve({
      checkin: [
        { createdAt: new Date() },
      ]
    })));
    mockUserService.isOnboarded.and.returnValue(new Promise((resolve, reject) => resolve(3)));
    spy.and.returnValue({
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": 'abc',
      }
    })

    component.submit(event);
    tick(7000);

    expect(router.navigate).toHaveBeenCalledWith(["app", "signup", 3]);
    flush();
  }));

  xit('should verify otp and go to home if sign up completed', fakeAsync(() => {
    component.step = 1;
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn<SmsOtpLoginComponent, any>(component, 'submit');
    let event = {
      target: {
        otpCode: { value: '234556' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({
      verifyLoginOtp: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiNDRlMGY3LTNhYzUtNDllZi04NWM4LTYzYWIxNGQ4YWQ3NyIsImlhdCI6MTY2MzE0MzM0OCwiZXhwIjoxNjYzMjI5NzQ4LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicGF0aWVudCIsInRoZXJhcGlzdCIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InBhdGllbnQiLCJ4LWhhc3VyYS11c2VyLWlkIjoiNGI0NGUwZjctM2FjNS00OWVmLTg1YzgtNjNhYjE0ZDhhZDc3IiwieC1oYXN1cmEtY2FyZXBsYW4taWQiOiI0MzE5MDIzYS1hMjRiLTRkMTktYWY4Mi1iZTkyZDE0ZjA5ZGUifX0.Ipb4g_Z45r2ukT5Xu0f1SchkpMYAHRx8eQHeLt78J_Q',
        }
      },
    })));
    mockDailyCheckinService.getLastCheckin.and.returnValue(new Promise((resolve, reject) => resolve({
      checkin: [
        { createdAt: new Date() },
      ]
    })));
    mockUserService.isOnboarded.and.returnValue(new Promise((resolve, reject) => resolve(-1)));
    spy.and.returnValue({
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": 'abc',
      }
    })

    component.submit(event);
    tick(7000);

    expect(router.navigate).toHaveBeenCalledWith(["app", "home"]);
    flush();
  }));

  it('should not verify otp if invalid', fakeAsync(() => {
    component.step = 1;
    spyOn(router, 'navigate').and.stub();
    spyOn<SmsOtpLoginComponent, any>(component, 'submit');
    let event = {
      target: {
        otpCode: { value: '234556' },
      }
    }
    mockGraphqlService.gqlRequest.and.returnValue(new Promise((resolve, reject) => resolve({})));
    mockDailyCheckinService.getLastCheckin.and.returnValue(new Promise((resolve, reject) => resolve({
      checkin: [
        { createdAt: new Date() },
      ]
    })));

    component.submit(event);
    tick(7000);

    expect(router.navigate).not.toHaveBeenCalled();
    flush();
  }));
});
