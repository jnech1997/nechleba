import { EnvironmentProviders, NO_ERRORS_SCHEMA, Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

/** Providers every component/service spec needs (HTTP, router, i18n, dialogs). */
export const commonTestProviders: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  provideNoopAnimations(),
  { provide: MatDialogRef, useValue: { close: () => {} } },
  { provide: MAT_DIALOG_DATA, useValue: {} },
];

/**
 * Configure TestBed for a smoke test.
 * - `modules`: NgModules that declare the component (e.g. ProjectsModule).
 * - `declarations`: non-standalone components to declare directly; unknown
 *   child elements are ignored so the test stays a shallow smoke test.
 */
export function configureTestBed(opts: {
  modules?: Type<unknown>[];
  declarations?: Type<unknown>[];
  standalone?: Type<unknown>[];
}) {
  return TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), ...(opts.modules ?? []), ...(opts.standalone ?? [])],
    declarations: opts.declarations ?? [],
    providers: commonTestProviders,
    schemas: opts.declarations ? [NO_ERRORS_SCHEMA] : [],
  }).compileComponents();
}
