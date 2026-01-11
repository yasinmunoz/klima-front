import { TestBed } from '@angular/core/testing';

import { KlimaService } from './klima-service';

describe('KlimaService', () => {
  let service: KlimaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KlimaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
