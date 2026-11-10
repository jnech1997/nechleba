import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ProjectsModule } from 'src/app/projects/projects.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('LoginComponent', () => {
  beforeEach(() => configureTestBed({ modules: [ProjectsModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
