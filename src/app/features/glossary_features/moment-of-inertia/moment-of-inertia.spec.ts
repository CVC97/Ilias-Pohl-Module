import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentOfInertia } from './moment-of-inertia';

describe('MomentOfInertia', () => {
  let component: MomentOfInertia;
  let fixture: ComponentFixture<MomentOfInertia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomentOfInertia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentOfInertia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
