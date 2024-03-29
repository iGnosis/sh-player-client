import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DailyCheckinComponent } from './daily-checkin.component';
import { UserService } from '../../services/user.service';
import { DailyCheckinService } from 'src/app/services/daily-checkin/daily-checkin.service';
import { AuthService } from 'src/app/services/auth.service';

describe('DailyCheckinComponent', () => {
  let router: Router;
  let component: DailyCheckinComponent;
  let fixture: ComponentFixture<DailyCheckinComponent>;
  let mockUserService = jasmine.createSpyObj('UserService', ['isOnboarded', 'get']);
  mockUserService.get.and.returnValue(JSON.parse('{"id":"4b44e0f7-3ac5-49ef-85c8-63ab14d8ad77"}'));
  const mockDailyCheckinService = jasmine.createSpyObj('DailyCheckinService', ['dailyCheckin']);
  const mockAuthService = jasmine.createSpyObj('DailyCheckinService', ['setGenreChoice']);

  function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, BrowserAnimationsModule],
      declarations: [ DailyCheckinComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: DailyCheckinService, useValue: mockDailyCheckinService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCheckinComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select mood', fakeAsync(() => {
    component.selectMood("Irritated");
    tick();

    expect(component.selectedMood).toEqual("Irritated");
    flush();
  }));
  it('should select genre and go to signup if not onboarded', fakeAsync(() => {
    mockUserService.isOnboarded.and.returnValue(new Promise((resolve) => resolve('profile')));
    spyOn(router, 'navigate').and.stub();

    component.selectGenre("Jazz");
    tick(1800);

    expect(component.selectedGenre).toEqual("Jazz");
    expect(router.navigate).toHaveBeenCalledWith(["/app/signup/setup"]);
    flush();
  }));
  it('should select genre and go to home if onboarded', fakeAsync(() => {
    mockUserService.isOnboarded.and.returnValue(new Promise((resolve) => resolve('finish')));
    spyOn(router, 'navigate').and.stub();

    component.selectGenre("Jazz");
    tick(1800);

    expect(component.selectedGenre).toEqual("Jazz");
    expect(router.navigate).toHaveBeenCalledWith(["app", "home"]);
    flush();
  }));
});
