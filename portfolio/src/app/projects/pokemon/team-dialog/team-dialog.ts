import { NgFor, NgIf, NgStyle } from "@angular/common";
import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

const TYPE_ADVANTAGES = {
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

const TYPE_DISADVANTAGES = {
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

const TYPES = ["Normal","Grass","Fire","Water","Fighting","Flying","Poison","Ground","Rock","Bug","Ghost","Electric","Psychic","Ice","Dragon","Dark","Steel","Fairy"];

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
  @ViewChild(MatSort) sort: MatSort;
  public pokemon;
  displayedColumns: string[] = ['id', 'sprite', "name", 'type', 'total', 'hp', 'attack', 'defense', 'speed', 'spattack', 'spdefense', 'actions'];
  team_non_advantages = [];
  team_weaknesses = [];

  ngOnInit() {
    this.team_non_advantages = [];
    this.pokemon =  this.data.pokemon.filter(p => this.data.team.includes(p.id));
    this.pokemon = new MatTableDataSource(this.pokemon.map(p => {
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
        weight: p.profile.weight,
        pokemon: p
      }
    }));
    this.processTeamAdvantages();
  }

  processTeamAdvantages() {
    let type_ads = [];
    let type_disads = [];
    for (let p of this.pokemon.filteredData) {
      for (let type of p.type) {
        type_ads = type_ads.concat(TYPE_ADVANTAGES[type]);
        type_disads = type_disads.concat(TYPE_DISADVANTAGES[type])
      }
    }
    for (let type of TYPES) {
      if (!type_ads.includes(type) && !this.team_non_advantages.includes(type)) {
        this.team_non_advantages.push(type);
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