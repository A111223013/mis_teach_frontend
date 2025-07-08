import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorRetrievalComponent } from './error-retrieval.component';

describe('ErrorRetrievalComponent', () => {
  let component: ErrorRetrievalComponent;
  let fixture: ComponentFixture<ErrorRetrievalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorRetrievalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
