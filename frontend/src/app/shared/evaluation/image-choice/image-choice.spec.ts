import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageChoice } from './image-choice';

describe('ImageChoice', () => {
  let component: ImageChoice;
  let fixture: ComponentFixture<ImageChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageChoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageChoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
