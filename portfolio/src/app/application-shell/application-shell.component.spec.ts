import { TestBed } from '@angular/core/testing';
import { ApplicationShellComponent } from './application-shell.component';

import { configureTestBed } from 'src/testing/test-setup';

describe('ApplicationShellComponent', () => {
  beforeEach(() => configureTestBed({ declarations: [ApplicationShellComponent] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(ApplicationShellComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
