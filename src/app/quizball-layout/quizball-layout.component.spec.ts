import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizballLayoutComponent } from './quizball-layout.component';

describe('QuizballLayoutComponent', () => {
  let component: QuizballLayoutComponent;
  let fixture: ComponentFixture<QuizballLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuizballLayoutComponent]
    });
    fixture = TestBed.createComponent(QuizballLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
