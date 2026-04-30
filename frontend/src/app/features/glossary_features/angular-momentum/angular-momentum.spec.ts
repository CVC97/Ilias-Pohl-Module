import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMomentum } from './angular-momentum';

describe('AngularMomentum', () => {
  let component: AngularMomentum;
  let fixture: ComponentFixture<AngularMomentum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMomentum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularMomentum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
