import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTeamBuilderComponent } from './pokemon-team-builder.component';

describe('PokemonComponent', () => {
  let component: PokemonTeamBuilderComponent;
  let fixture: ComponentFixture<PokemonTeamBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonTeamBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTeamBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
