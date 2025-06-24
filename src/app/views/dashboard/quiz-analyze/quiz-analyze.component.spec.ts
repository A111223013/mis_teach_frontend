import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAnalyzeComponent } from './quiz-analyze.component';

describe('QuizAnalyzeComponent', () => {
  let component: QuizAnalyzeComponent;
  let fixture: ComponentFixture<QuizAnalyzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAnalyzeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
