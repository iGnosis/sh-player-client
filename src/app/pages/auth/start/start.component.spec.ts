import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StartComponent } from './start.component';

describe('StartComponent', () => {
  let router: Router;
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ StartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page', () => {
    const spy = spyOn(router, 'navigate');

    component.signUp();

    expect(spy).toHaveBeenCalledWith(['public/login']);
  });

  it('should navigate to login page', () => {
    const spy = spyOn(router, 'navigate');

    component.login();

    expect(spy).toHaveBeenCalledWith(['public/login']);
  });

  it('should update carousel slide', () => {
    component.carouselSlide = 1;

    component.updateCarouselSlide(2);
    
    expect(component.carouselSlide).toEqual(2);
  });
});
