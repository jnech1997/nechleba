import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { configureTestBed } from 'src/testing/test-setup';

describe('AppComponent', () => {
  beforeEach(() => configureTestBed({ declarations: [AppComponent] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
