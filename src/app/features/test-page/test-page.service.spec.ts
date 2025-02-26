import { TestBed } from '@angular/core/testing';

import { TestPageService } from './test-page.service';

describe('TestPageService', () => {
  let service: TestPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
