import { TestBed } from '@angular/core/testing';
import { LanguageDialogComponent } from './language-dialog.component';

import { configureTestBed } from 'src/testing/test-setup';

describe('LanguageDialogComponent', () => {
  beforeEach(() => configureTestBed({ declarations: [LanguageDialogComponent] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(LanguageDialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
