import { AfterViewInit, Component, inject, model, OnInit, signal, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { NgFor, NgIf, NgStyle } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';

export interface DialogData {
  name: string;
  id: number;
  image: string;
  description: string;
  pokemon;
  base;
  evolution_chain;
  species;
  region;
  habitat;
  type;
  profile;
  total;
  addToTeam;
}

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrls: ["./sort-dialog.scss"],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgStyle,
    NgFor,
    NgIf,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatSort,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule
  ],
})
export class SortDialog {
  readonly dialogRef = inject(MatDialogRef<SortDialog>);
  public data = inject(MAT_DIALOG_DATA);
  private readonly _formBuilder = inject(FormBuilder);
  selectedRegion;
  searchTerm;

  types = this._formBuilder.group({
    Normal: false,
    Water: false,
    Fire: false,
    Grass: false,
    Psychic: false,
    Dark: false,
    Ground: false,
    Bug: false,
    Rock: false,
    Electric: false,
    Fairy: false,
    Fighting: false,
    Steel: false,
    Dragon: false,
    Ice: false,
    Flying: false,
    Ghost: false,
    Poison: false
  });
  
  regions: Region[] = [
    {value: 'Kanto', viewValue: 'Kanto'},
    {value: 'Johto', viewValue: 'Johto'},
    {value: 'Hoenn', viewValue: 'Hoenn'},
    {value: 'Sinnoh', viewValue: 'Sinnoh'},
    {value: 'Unova', viewValue: 'Unova'},
    {value: 'Kalos', viewValue: 'Kalos'},
  ];

  onApply() {
    this.data.filterPokemon(this.searchTerm, this.selectedRegion, this.types.value);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'team-dialog',
  templateUrl: './team-dialog.html',
  styleUrls: ["./team-dialog.scss"],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgStyle,
    NgFor,
    NgIf,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatSort,
    MatIconModule
  ],
})
export class TeamDialog implements OnInit, AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<TeamDialog>);
  public data = inject(MAT_DIALOG_DATA);
  pokemon;
  removeFromTeam;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'sprite', "name", 'type', 'total', 'hp', 'attack', 'defense', 'speed', 'spattack', 'spdefense', 'actions'];
  type_advantages = {
    'Bug': ['Grass', 'Dark', 'Psychic'],
    'Dark': ['Ghost', 'Psychic'],
    'Dragon': ['Dragon'],
    'Electric': ['Flying', 'Water'],
    'Fairy': ['Fighting', 'Dark', 'Dragon'],
    'Fighting': ['Dark', 'Ice', 'Normal', 'Rock', 'Steel'],
    'Fire': ['Bug', 'Grass', 'Ice', 'Steel'],
    'Flying': ['Bug', 'Fighting', 'Grass'],
    'Ghost': ['Ghost', 'Psychic'],
    'Grass': ['Ground', 'Rock', 'Water'],
    'Ground': ['Electric', 'Fire', 'Poison', 'Rock', 'Steel'],
    'Ice': ['Dragon', 'Flying', 'Grass', 'Ground'],
    'Normal': [],
    'Poison': ['Fairy', 'Grass'],
    'Psychic': ['Fighting', 'Poison'],
    'Rock': ['Bug', 'Fire', 'Flying', 'Ice'],
    'Steel': ['Fairy', 'Ice', 'Rock'],
    'Water': ['Fire', 'Ground', 'Rock']
  };
  type_disadvantages = {
    'Bug': ['Fire', 'Flying', 'Rock'],
    'Dark': ['Bug', 'Fairy', 'Fighting'],
    'Dragon': ['Dragon', 'Fairy', 'Ice'],
    'Electric': ['Ground'],
    'Fairy': ['Poison', 'Steel'],
    'Fighting': ['Fairy', 'Fighting', 'Psychic'],
    'Fire': ['Ground', 'Rock', 'Water'],
    'Flying': ['Electric', 'Ice', 'Rock'],
    'Ghost': ['Dark', 'Ghost'],
    'Grass': ['Bug', 'Fire', 'Flying', 'Ice', 'Poison'],
    'Ground': ['Grass', 'Ice', 'Water'],
    'Ice': ['Fighting', 'Fire', 'Rock', 'Steel'],
    'Normal': ['Fighting'],
    'Poison': ['Ground', 'Psychic'],
    'Psychic': ['Bug', 'Dark', 'Ghost'],
    'Rock': ['Fighting', 'Grass', 'Ground', 'Steel', 'Water'],
    'Steel': ['Fighting', 'Fire', 'Ground'],
    'Water': ['Electric', 'Grass']
  };
  types = ["Normal","Grass","Fire","Water","Fighting","Flying","Poison","Ground","Rock","Bug","Ghost","Electric","Psychic","Ice","Dragon","Dark","Steel","Fairy"]
  type_non_ads = []
  team_weaknesses = []

  ngOnInit() {
    this.type_non_ads = [];
    this.pokemon =  this.data.pokemon.filter(p => this.data.team.includes(p.id));
    this.pokemon = this.pokemon.map(p => {
      return {
        id: p.id,
        name: p.name['english'],
        sprite: p.image['sprite'],
        type: p.type,
        total: p.total,
        hp: p.base.HP,
        attack: p.base.Attack,
        defense: p.base.Defense,
        speed: p.base.Speed,
        spattack: p.base.Sp[" Attack"],
        spdefense: p.base.Sp[" Defense"],
        height: p.profile.height,
        weight: p.profile.weight
      }
    });
    this.pokemon = new MatTableDataSource(this.pokemon);
    this.processTeamAdvantages();
  }

  processTeamAdvantages() {
    let type_ads = [];
    let type_disads = [];
    for (let p of this.pokemon.filteredData) {
      for (let type of p.type) {
        type_ads = type_ads.concat(this.type_advantages[type]);
        type_disads = type_disads.concat(this.type_disadvantages[type])
      }
    }
    for (let type of this.types) {
      if (!type_ads.includes(type) && !this.type_non_ads.includes(type)) {
        this.type_non_ads.push(type);
      }
    }
    // compute top five type disadvantages
    let type_disad_counter = {};
    for (let type of type_disads) {
      if (type_disad_counter[type]) {
        type_disad_counter[type] = type_disad_counter[type] + 1;
      }
      else {
        type_disad_counter[type] = 1;
      }
    }
    const arr = Object.entries(type_disad_counter).map(([type, freq]) => [
      freq,
      type,
    ]);
    arr.sort((a:any[], b: any[]) => b[0] - a[0]);
    this.team_weaknesses = arr.slice(0, arr.length >= 5 ? 5 : arr.length).map((pair) => pair[1]);
  }

  deleteRow(row: any): void {
    this.data.removeFromTeam(row.id);
    this.pokemon = new MatTableDataSource(this.pokemon.filteredData.filter(item => item !== row));
    this.pokemon.sort = this.sort;
    this.processTeamAdvantages();
    if (this.pokemon.filteredData.length == 0) {
      this.onNoClick();
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

  ngAfterViewInit(): void {
    this.pokemon.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ["dialog-overview-example-dialog.scss"],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgStyle,
    NgFor,
    NgIf,
    MatCardModule,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  public data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);

  onNoClick(): void {
    this.dialogRef.close();
  }

  incrementPokemonModal(pokemon_id) {
    let inced = parseInt(pokemon_id) + 1;
    if (inced < 810) {
      this.switchPokemonModal(inced);
    }
  }

  decrementPokemonModal(pokemon_id) {
    let inced = parseInt(pokemon_id) - 1;
    if (inced > 0) {
      this.switchPokemonModal(inced);
    }
  }

  switchPokemonModal(pokemon_id) {
    if (pokemon_id != this.data.id) {
      let p = this.data.pokemon.find(p_info => p_info.id === pokemon_id);
      this.data = {
        name: p.name, 
        id: p.id,
        image: p.image,
        description: p.description,
        base: p.base,
        evolution_chain: this.getEvolutionChain(p.evolution_chain), 
        species: p.species,
        region: p.region,
        habitat: p.habitat,
        type: p.type,
        profile: p.profile,
        total: p.total,
        pokemon: this.data.pokemon,
        addToTeam: this.data.addToTeam
      }
    }
  }

  getEvolutionChain(evolution_ids) {
    if (!!evolution_ids) {
      let evo_chain = []
      for (const evolution of evolution_ids) {
        let p_info = this.data.pokemon.find(p => !!p && p.id == evolution["id"] && p.id < 810);
        if (!!p_info) {
          evo_chain.push([p_info.id, p_info.image['sprite'], evolution["condition"]]);
        }
      }
      if (evo_chain.length > 1) {return evo_chain}
      return []
    }
  }

  cancelSound() {
    let synth = window.speechSynthesis;
    synth.cancel();
  }

  soundDescribe(data) {
    let synth = window.speechSynthesis;
    if (!!synth && synth.speaking) {
      synth.cancel();
    }
    else if (!!synth) {
      let textToSpeak = data.name['english'] + ", a " + data.species + "! " + data.description;
      let msg = new SpeechSynthesisUtterance(textToSpeak);
      synth.speak(msg);
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
}

@Component({
  selector: "app-pokemon",
  templateUrl: "./pokemon.component.html",
  styleUrls: ["./pokemon.component.scss"],
  standalone: false,
})
export class PokemonComponent implements OnInit {
  public pokemon = [];
  public loading = true;
  filteredPokemon = [];
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);
  public team = [];
  mobileQuery: MediaQueryList;

  constructor(private http: HttpClient, public media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
  }

  ngOnInit(): void {
    this.http.get("/api/pokemon").subscribe(
      (pokemon_list) => {
        this.loading = false;
        this.pokemon = pokemon_list["list_pokemon"].filter((pokemon) =>
          this.isValidPokemon(pokemon)
        );
        this.filteredPokemon = this.pokemon;
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
    }
  }

  removeFromTeam(pokemon_id) {
    this.team = this.team.filter(p => {
      return p != pokemon_id
    });
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
  }

  openSortDialog() {
    const dialogRef = this.dialog.open(SortDialog, {
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
        removeFromTeam: this.removeFromTeam.bind(this)
      },
    });
  }

  openDialog(pokemon): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
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
