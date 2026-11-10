import { TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ProjectsModule } from 'src/app/projects/projects.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('ProjectsComponent', () => {
  beforeEach(() => configureTestBed({ modules: [ProjectsModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
