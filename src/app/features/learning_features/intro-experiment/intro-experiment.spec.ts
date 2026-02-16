import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroExperiment } from './intro-experiment';

describe('IntroExperiment', () => {
  let component: IntroExperiment;
  let fixture: ComponentFixture<IntroExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
