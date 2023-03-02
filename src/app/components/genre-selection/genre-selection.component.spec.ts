import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreSelectionComponent } from './genre-selection.component';
import { HttpClientModule } from '@angular/common/http';

describe('GenreSelectionComponent', () => {
  let component: GenreSelectionComponent;
  let fixture: ComponentFixture<GenreSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenreSelectionComponent ],
      imports: [HttpClientModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
