import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFrequency } from './angular-frequency';

describe('AngularFrequency', () => {
  let component: AngularFrequency;
  let fixture: ComponentFixture<AngularFrequency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularFrequency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularFrequency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
