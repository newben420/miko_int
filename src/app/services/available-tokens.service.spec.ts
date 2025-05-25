import { TestBed } from '@angular/core/testing';

import { AvailableTokensService } from './available-tokens.service';

describe('AvailableTokensService', () => {
  let service: AvailableTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableTokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
