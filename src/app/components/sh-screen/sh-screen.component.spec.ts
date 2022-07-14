import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShScreenComponent } from './sh-screen.component';

describe('ShScreenComponent', () => {
  let component: ShScreenComponent;
  let fixture: ComponentFixture<ShScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
