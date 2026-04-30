import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DampedOscillations } from './damped-oscillations';

describe('DampedOscillations', () => {
  let component: DampedOscillations;
  let fixture: ComponentFixture<DampedOscillations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DampedOscillations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DampedOscillations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
