import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoice } from './multiple-choice';

describe('MultipleChoice', () => {
  let component: MultipleChoice;
  let fixture: ComponentFixture<MultipleChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
