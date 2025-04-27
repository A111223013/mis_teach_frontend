import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastExamReviewComponent } from './past-exam-review.component';

describe('PastExamReviewComponent', () => {
  let component: PastExamReviewComponent;
  let fixture: ComponentFixture<PastExamReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastExamReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastExamReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
