import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderImages } from './order-images';

describe('OrderImages', () => {
  let component: OrderImages;
  let fixture: ComponentFixture<OrderImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderImages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
