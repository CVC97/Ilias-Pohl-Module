import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DampingCoefficient } from './damping-coefficient';

describe('DampingCoefficient', () => {
  let component: DampingCoefficient;
  let fixture: ComponentFixture<DampingCoefficient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DampingCoefficient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DampingCoefficient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
