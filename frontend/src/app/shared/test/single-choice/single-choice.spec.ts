import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoice } from './single-choice';

describe('SingleChoice', () => {
  let component: SingleChoice;
  let fixture: ComponentFixture<SingleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleChoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
