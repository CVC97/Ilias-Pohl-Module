import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evaluation } from './evaluation';

describe('Evaluation', () => {
  let component: Evaluation;
  let fixture: ComponentFixture<Evaluation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evaluation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
