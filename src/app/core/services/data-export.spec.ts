import { TestBed } from '@angular/core/testing';

import { DataExport } from './data-export';

describe('DataExport', () => {
  let service: DataExport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
