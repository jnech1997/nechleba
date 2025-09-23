import { Component, inject, model, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { FilterDialog } from "./filter-dialog/filter-dialog";
import { TeamDialog } from "./team-dialog/team-dialog";
import { PokedexDialog } from "./pokedex-dialog/pokedex-dialog";
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ServerService } from "src/app/services/server.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "pokemon-team-builder",
  templateUrl: "./pokemon-team-builder.component.html",
  styleUrls: ["./pokemon-team-builder.component.scss"],
  standalone: false,
})
export class PokemonTeamBuilderComponent implements OnInit {
  public pokemon = [];
  public loading = true;
  public filteredPokemon = [];
  public team: any = {
    name: "",
    pokemon_ids: []
  };
  readonly dialog = inject(MatDialog);
  mobileQuery: MediaQueryList;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private http: HttpClient, 
    public media: MediaMatcher,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
  }

  ngOnInit(): void {
    if (window.sessionStorage.getItem('pokemon-team')) {
      this.team = JSON.parse(window.sessionStorage.getItem('pokemon-team'));
    }
    if (this.route.snapshot.paramMap.get('id')) {
      this.server.request('GET', '/pokemonteam/' + this.route.snapshot.paramMap.get('id')).subscribe((team: any) => {
      this.team = team
    });
    // populate pokemon, using session storage caching if possible
    }
    if (window.sessionStorage.getItem('pokemon')) {
      this.loading = false;
      this.pokemon = JSON.parse(window.sessionStorage.getItem('pokemon'));
      if (window.sessionStorage.getItem('filteredPokemon')) {
            this.filteredPokemon = JSON.parse(window.sessionStorage.getItem('filteredPokemon'));
      } else {
        this.filteredPokemon = this.pokemon;
      }
    }
    else {
      this.http.get("/api/pokemon").subscribe(
        (pokemon_list) => {
          this.loading = false;
          this.pokemon = pokemon_list["list_pokemon"].filter((pokemon) =>
            this.isValidPokemon(pokemon)
          );
          window.sessionStorage.setItem('pokemon', JSON.stringify(this.pokemon));
          if (window.sessionStorage.getItem('filteredPokemon')) {
            this.filteredPokemon = JSON.parse(window.sessionStorage.getItem('filteredPokemon'));
          } else {
            this.filteredPokemon = this.pokemon;
          }
        },
        (error: any) => {
          console.debug("request to database failed");
        }
      );
    }
  }

  deleteTeam() {
    if (this.route.snapshot.paramMap.get('id')) {
      const request = this.server.request('DELETE', '/pokemonteam/' + this.route.snapshot.paramMap.get('id')).subscribe((response: any) => {
        window.sessionStorage.removeItem('pokemon-team');
        this.team = {
          name: "",
          pokemon_ids: []
        }
        this.router.navigateByUrl('/projects/sandbox/pokemonteam');
      }); 
    }
  }

  saveTeam() {
    if (this.route.snapshot.paramMap.get('id')) {
      const request = this.server.request('PUT', '/pokemonteam/' + this.route.snapshot.paramMap.get('id'), {
        name: this.team.name ? this.team.name : "Team Rocket",
        pokemon_ids: this.team.pokemon_ids
      }).subscribe((response: any) => {
        this.openSnackBar("Saved Team", "Okay");
      }); 
    }
    else {
      const request = this.server.request('POST', '/pokemonteam', {
        name: this.team.name ? this.team.name : "Team Rocket",
        pokemon_ids: this.team.pokemon_ids
      }).subscribe((response: any) => {
        window.sessionStorage.removeItem('pokemon-team');
        this.team = {};
        this.router.navigateByUrl('/projects/sandbox/pokemonteam');
      }); 
    }
  }

  accessMyTeams() {
    this.router.navigateByUrl('/projects/sandbox/pokemonteam');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }

  addToTeam(event, pokemon_id) {
    if (event) {
      event.stopPropagation();
    }
    if (this.team.pokemon_ids.length < 6 && !this.team.pokemon_ids.includes(pokemon_id)) {
      this.team.pokemon_ids.push(pokemon_id);
      if (this.mobileQuery.matches) {
        const message = "Added to your team!";
        this.openSnackBar(message, "Okay")
      }
      else {
        let name = this.pokemon.filter(p => p.id == pokemon_id)[0].name['english'];
        const message = "Added " + name + " to your team!";
        this.openSnackBar(message, "Okay");
      }
      window.sessionStorage.setItem('pokemon-team', JSON.stringify(this.team));
    }
  }

  editTeamName(name: string) {
    this.team.name = name;
  }

  removeFromTeam(pokemon_id) {
    this.team.pokemon_ids = this.team.pokemon_ids.filter(p => {
      return p != pokemon_id
    });
    window.sessionStorage.setItem('pokemon-team', JSON.stringify(this.team));
  }

  filterPokemon(searchTerm?: string, region?: string, types?: any) {
    this.filteredPokemon = this.pokemon;
    if (!!searchTerm) {
      this.filteredPokemon = this.filteredPokemon.filter(item => {
        return item.name["english"].toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    if (!!region) {
      this.filteredPokemon = this.filteredPokemon.filter(p => {
        return p.region == region;
      });
    }
    if (!!types) {
      this.filteredPokemon = this.filteredPokemon.filter(p => {
        for (let type in types) {
          if (types[type] && !p.type.includes(type)) {
            return false;
          }
        }
        return true;
      })
    }
    window.sessionStorage.setItem('filteredPokemon', JSON.stringify(this.filteredPokemon));
  }

  openSortDialog() {
    const dialogRef = this.dialog.open(FilterDialog, {
      data: {
        filterPokemon: this.filterPokemon.bind(this)
      },
    });
  }

  openTeamDialog() {
    const dialogRef = this.dialog.open(TeamDialog, {
      data: {
        team: this.team,
        pokemon: this.pokemon,
        openPokedexDialog: this.openPokedexDialog.bind(this),
        removeFromTeam: this.removeFromTeam.bind(this),
        editTeamName: this.editTeamName.bind(this),
        saveTeam: this.saveTeam.bind(this),
        deleteTeam: this.deleteTeam.bind(this)
      },
    });
  }

  openPokedexDialog(pokemon): void {
    const dialogRef = this.dialog.open(PokedexDialog, {
      data: {
        name: pokemon.name, 
        id: pokemon.id,
        image: pokemon.image,
        description: pokemon.description,
        base: pokemon.base,
        evolution_chain: this.getEvolutionChain(pokemon.evolution_chain), 
        species: pokemon.species,
        region: pokemon.region,
        habitat: pokemon.habitat,
        type: pokemon.type,
        profile: pokemon.profile,
        total: pokemon.total,
        pokemon: this.pokemon,
        addToTeam: this.addToTeam.bind(this)
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.speechSynthesis.cancel();
    });
  }

  getEvolutionChain(evolution_ids) {
    if (!!evolution_ids) {
      let evo_chain = []
      for (const evolution of evolution_ids) {
        let p_info = this.pokemon.find(p => !!p && p.id == evolution["id"] && p.id < 810);
        if (!!p_info) {
          evo_chain.push([p_info.id, p_info.image['sprite'], evolution["condition"]]);
        }
      }
      if (evo_chain.length > 1) {return evo_chain}
      return []
    }
  }

  linearGradient(types: string[]): string {
    let l = "linear-gradient(";
    for (let type of types) {
      l += this.typeToColor(type) + ","
    }
    l = l.slice(0, -1);
    l += ")";
    return l;
  }

  computeTripleDigitNumber(number: number): string {
    if ((number / 10) < 1) {
      return "00" + number;
    }
    else if ((number / 10) < 10) {
      return "0" + number;
    }
    else {
      return "" + number;
    }
  }

  typeToColor(type: string): string {
    switch (type) {
      case "Normal":
        return "#bbb9ac";
      case "Grass":
        return "#91c854";
      case "Fire":
        return "#f05848";
      case "Water":
        return "#6aa7db";
      case "Fighting":
        return "#a95848";
      case "Flying":
        return "#849dd2";
      case "Poison":
        return "#a95ca1";
      case "Ground":
        return "#e8c656";
      case "Rock":
        return "#cebb71";
      case "Bug":
        return "#c2d230";
      case "Ghost":
        return "#7673b6";
      case "Electric":
        return "#fde03a";
      case "Psychic":
        return "#ea64a5";
      case "Ice":
        return "#a5ddee";
      case "Dragon":
        return "#7772b6";
      case "Dark":
        return "#8d6957";
      case "Steel":
        return "#c3c2d9";
      case "Fairy":
        return "#deb1d2";
      default:
        return "" 
    }
  }

  isValidPokemon(pokemon): boolean {
    // following images from database are invalid, clean data todo
    let img = pokemon["image"]["hires"];
    let name = pokemon["name"]["english"];
    return !!img && !!name && pokemon.id < 810;
  }
}
