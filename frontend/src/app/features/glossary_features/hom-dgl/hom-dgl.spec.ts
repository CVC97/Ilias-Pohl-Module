import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomDgl } from './hom-dgl';

describe('HomDgl', () => {
  let component: HomDgl;
  let fixture: ComponentFixture<HomDgl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomDgl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomDgl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
