import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDampedOscillation } from './t-damped-oscillation';

describe('TDampedOscillation', () => {
  let component: TDampedOscillation;
  let fixture: ComponentFixture<TDampedOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDampedOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TDampedOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
