import { NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface PokemonData {
  name: string;
  id: number;
  image: string;
  description: string;
  base;
  evolution_chain;
  species;
  region;
  habitat;
  type;
  profile;
  total;
  addToTeam;
  pokemon;
}

@Component({
  selector: 'pokedex-dialog',
  templateUrl: 'pokedex-dialog.html',
  styleUrls: ["pokedex-dialog.scss"],
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
export class PokedexDialog {
  readonly dialogRef = inject(MatDialogRef<PokedexDialog>);
  public data = inject<PokemonData>(MAT_DIALOG_DATA);
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