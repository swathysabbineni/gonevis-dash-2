import { TestBed } from '@angular/core/testing';

import { SettingsBillingService } from './settings-billing.service';

describe('SettingsBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsBillingService = TestBed.get(SettingsBillingService);
    expect(service).toBeTruthy();
  });
});
