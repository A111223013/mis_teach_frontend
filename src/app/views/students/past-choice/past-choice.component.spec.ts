import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastChoiceComponent } from './past-choice.component';

describe('PastChoiceComponent', () => {
  let component: PastChoiceComponent;
  let fixture: ComponentFixture<PastChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastChoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
