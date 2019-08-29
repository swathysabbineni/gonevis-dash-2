import { TestBed } from '@angular/core/testing';

import { UsersModalService } from './users-modal.service';

describe('UsersModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersModalService = TestBed.get(UsersModalService);
    expect(service).toBeTruthy();
  });
});
