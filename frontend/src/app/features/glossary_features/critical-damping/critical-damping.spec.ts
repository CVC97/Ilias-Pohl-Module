import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalDamping } from './critical-damping';

describe('CriticalDamping', () => {
  let component: CriticalDamping;
  let fixture: ComponentFixture<CriticalDamping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalDamping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriticalDamping);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
