import { TestBed } from '@angular/core/testing';

import { LocaleNotDefinedGuard } from './locale-not-defined.guard';

describe('LocaleNotDefinedGuard', () => {
  let guard: LocaleNotDefinedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LocaleNotDefinedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
