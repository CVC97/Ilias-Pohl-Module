import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DampedOscillationsExperiment } from './damped-oscillations-experiment';

describe('DampedOscillationsExperiment', () => {
  let component: DampedOscillationsExperiment;
  let fixture: ComponentFixture<DampedOscillationsExperiment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DampedOscillationsExperiment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DampedOscillationsExperiment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
