import { TestBed } from '@angular/core/testing';

import { DashGuardService } from './dash-guard.service';

describe('DashGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashGuardService = TestBed.get(DashGuardService);
    expect(service).toBeTruthy();
  });
});
