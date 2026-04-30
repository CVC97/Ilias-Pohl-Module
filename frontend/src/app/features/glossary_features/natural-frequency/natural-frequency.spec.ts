import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalFrequency } from './natural-frequency';

describe('NaturalFrequency', () => {
  let component: NaturalFrequency;
  let fixture: ComponentFixture<NaturalFrequency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturalFrequency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalFrequency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
