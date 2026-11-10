import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbModule } from './breadcrumb.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('BreadcrumbComponent', () => {
  beforeEach(() => configureTestBed({ modules: [BreadcrumbModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
