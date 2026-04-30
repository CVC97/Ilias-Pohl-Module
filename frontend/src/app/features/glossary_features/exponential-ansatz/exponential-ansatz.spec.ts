import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExponentialAnsatz } from './exponential-ansatz';

describe('ExponentialAnsatz', () => {
  let component: ExponentialAnsatz;
  let fixture: ComponentFixture<ExponentialAnsatz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExponentialAnsatz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExponentialAnsatz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
