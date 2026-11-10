import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { commonTestProviders } from 'src/testing/test-setup';

describe('BreadcrumbService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: commonTestProviders }));

  it('should be created', () => {
    expect(TestBed.inject(BreadcrumbService)).toBeTruthy();
  });
});
