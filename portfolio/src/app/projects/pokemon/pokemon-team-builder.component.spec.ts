import { TestBed } from '@angular/core/testing';
import { PokemonTeamBuilderComponent } from './pokemon-team-builder.component';
import { ProjectsModule } from 'src/app/projects/projects.module';
import { configureTestBed } from 'src/testing/test-setup';

describe('PokemonTeamBuilderComponent', () => {
  beforeEach(() => configureTestBed({ modules: [ProjectsModule] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(PokemonTeamBuilderComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
