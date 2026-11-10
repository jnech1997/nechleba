import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { commonTestProviders } from 'src/testing/test-setup';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: commonTestProviders }));

  it('should be created', () => {
    expect(TestBed.inject(AuthService)).toBeTruthy();
  });
});
