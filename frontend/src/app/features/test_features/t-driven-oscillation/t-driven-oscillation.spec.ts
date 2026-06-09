import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDrivenOscillation } from './t-driven-oscillation';

describe('TDrivenOscillation', () => {
  let component: TDrivenOscillation;
  let fixture: ComponentFixture<TDrivenOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDrivenOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TDrivenOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
