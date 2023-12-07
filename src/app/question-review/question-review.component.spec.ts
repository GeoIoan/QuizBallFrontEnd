import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionReviewComponent } from './question-review.component';

describe('QuestionReviewComponent', () => {
  let component: QuestionReviewComponent;
  let fixture: ComponentFixture<QuestionReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionReviewComponent]
    });
    fixture = TestBed.createComponent(QuestionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
