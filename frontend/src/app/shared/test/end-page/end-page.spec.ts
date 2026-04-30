import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndPage } from './end-page';

describe('EndPage', () => {
  let component: EndPage;
  let fixture: ComponentFixture<EndPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
