import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDrivenOscillation } from './e-driven-oscillation';

describe('EDrivenOscillation', () => {
  let component: EDrivenOscillation;
  let fixture: ComponentFixture<EDrivenOscillation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDrivenOscillation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EDrivenOscillation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
