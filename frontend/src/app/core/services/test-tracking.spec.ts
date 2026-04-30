import { TestBed } from '@angular/core/testing';

import { TestTracking } from './test-tracking';

describe('TestTracking', () => {
  let service: TestTracking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestTracking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
