import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {

  public pokemon = [];
  public loading = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/pokemon').subscribe((pokemon_list) => {
      this.loading = false;
      this.pokemon = pokemon_list["list_pokemon"].filter((pokemon) => this.isValidPokemon(pokemon));
    }, (error: any) => {
      console.debug("request to database failed");
    });
  }

  isValidPokemon(pokemon : string): boolean {
    // following images from database are invalid, clean data todo
    let img = pokemon["img"];
    let validImg = img !== "http://img.pokemondb.net/artwork/farfetch'd.jpg" &&
           img !== "https://img.pokemondb.net/artwork/mr.%20mime.jpg" && 
           img !== "http://img.pokemondb.net/artwork/nidoran?.jpg"
    let name = pokemon["name"];
    return validImg && name != "Mr. Mime";
  }

}
