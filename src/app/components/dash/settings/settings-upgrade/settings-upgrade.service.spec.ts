import { TestBed } from '@angular/core/testing';

import { SettingsUpgradeService } from './settings-upgrade.service';

describe('SettingsUpgradeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsUpgradeService = TestBed.get(SettingsUpgradeService);
    expect(service).toBeTruthy();
  });
});
