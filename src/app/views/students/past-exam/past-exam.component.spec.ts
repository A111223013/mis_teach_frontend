import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastExamComponent } from './past-exam.component';

describe('PastExamComponent', () => {
  let component: PastExamComponent;
  let fixture: ComponentFixture<PastExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
