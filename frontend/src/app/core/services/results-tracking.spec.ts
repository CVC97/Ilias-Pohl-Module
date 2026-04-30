import { TestBed } from '@angular/core/testing';

import { ResultsTracking } from './results-tracking';

describe('ResultsTracking', () => {
  let service: ResultsTracking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsTracking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
