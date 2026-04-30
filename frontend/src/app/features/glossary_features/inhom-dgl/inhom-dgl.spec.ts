import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InhomDgl } from './inhom-dgl';

describe('InhomDgl', () => {
  let component: InhomDgl;
  let fixture: ComponentFixture<InhomDgl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InhomDgl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InhomDgl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
