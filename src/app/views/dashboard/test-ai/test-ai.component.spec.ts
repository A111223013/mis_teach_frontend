import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAiComponent } from './test-ai.component';

describe('TestAiComponent', () => {
  let component: TestAiComponent;
  let fixture: ComponentFixture<TestAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
