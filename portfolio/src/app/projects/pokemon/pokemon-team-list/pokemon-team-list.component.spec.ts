import { TestBed } from '@angular/core/testing';
import { PokemonTeamListComponent } from './pokemon-team-list.component';

import { configureTestBed } from 'src/testing/test-setup';

describe('PokemonTeamListComponent', () => {
  beforeEach(() => configureTestBed({ standalone: [PokemonTeamListComponent] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(PokemonTeamListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
