import { Component, inject, model, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { FilterDialog } from "./filter-dialog/filter-dialog";
import { TeamDialog } from "./team-dialog/team-dialog";
import { PokedexDialog } from "./pokedex-dialog/pokedex-dialog";

@Component({
  selector: "app-pokemon",
  templateUrl: "./pokemon.component.html",
  styleUrls: ["./pokemon.component.scss"],
  standalone: false,
})
export class PokemonComponent implements OnInit {
  public pokemon = [];
  public loading = true;
  public filteredPokemon = [];
  public team = [];
  readonly dialog = inject(MatDialog);
  mobileQuery: MediaQueryList;

  constructor(private http: HttpClient, public media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
  }

  ngOnInit(): void {
    if (window.sessionStorage.getItem('pokemon-team')) {
      this.team = JSON.parse(window.sessionStorage.getItem('pokemon-team'));
    }
    this.http.get("/api/pokemon").subscribe(
      (pokemon_list) => {
        this.loading = false;
        this.pokemon = pokemon_list["list_pokemon"].filter((pokemon) =>
          this.isValidPokemon(pokemon)
        );
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

  addToTeam(event, pokemon_id) {
    if (event) {
      event.stopPropagation();
    }
    if (this.team.length < 6 && !this.team.includes(pokemon_id)) {
      this.team.push(pokemon_id);
      window.sessionStorage.setItem('pokemon-team', JSON.stringify(this.team));
    }
  }

  removeFromTeam(pokemon_id) {
    this.team = this.team.filter(p => {
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
        removeFromTeam: this.removeFromTeam.bind(this)
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
