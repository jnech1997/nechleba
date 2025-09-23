import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { TeamDialog } from '../team-dialog/team-dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pokemon-team-list',
  imports: [
    NgFor,
    MatButton,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './pokemon-team-list.component.html',
  styleUrl: './pokemon-team-list.component.scss'
})
export class PokemonTeamListComponent implements OnInit {
  public loading = true;
  public teams;
  public pokemon;
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient, private server: ServerService, private router: Router) {}

  ngOnInit() {
    if (window.sessionStorage.getItem('pokemon')) {
      this.pokemon = JSON.parse(window.sessionStorage.getItem('pokemon'));
      this.loading = false;
      this.server.request('GET', '/pokemonteam').subscribe((teams: any) => {
        this.teams = teams;
      });
    }
    else {
      this.http.get("/api/pokemon").subscribe(
        (pokemon_list) => {
          this.loading = false;
          this.server.request('GET', '/pokemonteam').subscribe((teams: any) => {
            this.teams = teams;
          });
          this.pokemon = pokemon_list["list_pokemon"].filter((pokemon) =>
            this.isValidPokemon(pokemon)
          );
          window.sessionStorage.setItem('pokemon', JSON.stringify(this.pokemon));
        }
      );
    }
  }

  deleteTeam($event, team) {
    $event.stopPropagation();
    this.teams = this.teams.filter((t) => t._id != team._id)
    if (team._id) {
      const request = this.server.request('DELETE', '/pokemonteam/' + team._id).subscribe((response: any) => {
        this._snackBar.open("Deleted " + team.name, "Okay");
      }); 
    }
  }

  viewTeam($event, team) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(TeamDialog, {
      data: {
        viewMode: 1,
        team: team,
        pokemon: this.pokemon
      },
    });
  }

  createNewTeam() {
    window.sessionStorage.removeItem('pokemon-team');
    this.router.navigateByUrl('projects/sandbox/pokemonteam/new');
  }

  isValidPokemon(pokemon): boolean {
    // following images from database are invalid, clean data todo
    let img = pokemon["image"]["hires"];
    let name = pokemon["name"]["english"];
    return !!img && !!name && pokemon.id < 810;
  }
}
