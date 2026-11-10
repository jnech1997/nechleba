import { TestBed } from '@angular/core/testing';
import { SandboxComponent } from './sandbox.component';
import { ProjectsModule } from 'src/app/projects/projects.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('SandboxComponent', () => {
  beforeEach(() => configureTestBed({ modules: [ProjectsModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(SandboxComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
