import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTrueFalse } from './test-true-false';

describe('TestTrueFalse', () => {
  let component: TestTrueFalse;
  let fixture: ComponentFixture<TestTrueFalse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTrueFalse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTrueFalse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
