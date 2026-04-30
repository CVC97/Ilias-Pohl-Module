import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceImage } from './multiple-choice-image';

describe('MultipleChoiceImage', () => {
  let component: MultipleChoiceImage;
  let fixture: ComponentFixture<MultipleChoiceImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
