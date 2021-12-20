import { TestBed } from '@angular/core/testing';

import { CartlistServiceService } from './cartlist-service.service';

describe('CartlistServiceService', () => {
  let service: CartlistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartlistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
