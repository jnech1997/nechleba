import { TestBed } from '@angular/core/testing';
import { ServerService } from './server.service';
import { commonTestProviders } from 'src/testing/test-setup';

describe('ServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: commonTestProviders }));

  it('should be created', () => {
    expect(TestBed.inject(ServerService)).toBeTruthy();
  });
});
