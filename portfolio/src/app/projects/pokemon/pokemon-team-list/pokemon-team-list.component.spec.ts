import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTeamListComponent } from './pokemon-team-list.component';

describe('TeamsComponent', () => {
  let component: PokemonTeamListComponent;
  let fixture: ComponentFixture<PokemonTeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTeamListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
