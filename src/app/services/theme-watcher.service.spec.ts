import { TestBed } from '@angular/core/testing';

import { ThemeWatcherService } from './theme-watcher.service';

describe('ThemeWatcherService', () => {
  let service: ThemeWatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeWatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
