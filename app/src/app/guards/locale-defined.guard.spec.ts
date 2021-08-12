import { TestBed } from '@angular/core/testing';

import { LocaleDefinedGuard } from './locale-defined.guard';

describe('LocaleDefinedGuard', () => {
  let guard: LocaleDefinedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LocaleDefinedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
