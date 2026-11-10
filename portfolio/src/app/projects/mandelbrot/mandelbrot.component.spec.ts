import { TestBed } from '@angular/core/testing';
import { MandelbrotComponent } from './mandelbrot.component';
import { ProjectsModule } from 'src/app/projects/projects.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('MandelbrotComponent', () => {
  beforeEach(() => configureTestBed({ modules: [ProjectsModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(MandelbrotComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
