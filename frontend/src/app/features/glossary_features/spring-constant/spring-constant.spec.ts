import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpringConstant } from './spring-constant';

describe('SpringConstant', () => {
  let component: SpringConstant;
  let fixture: ComponentFixture<SpringConstant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpringConstant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpringConstant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
