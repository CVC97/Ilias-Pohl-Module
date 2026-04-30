import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amplitude } from './amplitude';

describe('Amplitude', () => {
  let component: Amplitude;
  let fixture: ComponentFixture<Amplitude>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Amplitude]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Amplitude);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
