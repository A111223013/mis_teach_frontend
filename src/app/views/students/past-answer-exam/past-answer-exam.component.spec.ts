import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAnswerExamComponent } from './past-answer-exam.component';

describe('PastAnswerExamComponent', () => {
  let component: PastAnswerExamComponent;
  let fixture: ComponentFixture<PastAnswerExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastAnswerExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastAnswerExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
