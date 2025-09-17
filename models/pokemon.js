var mongoose = require('mongoose');

// Define the sub-schema for individual objects in the array
const evolutionSchema = new mongoose.Schema({
  id: { type: Number },
  evolves_from: { type: Number },
  condition: { type: String }
});

var PokemonSchema = new mongoose.Schema({
  id: { type: Number },
  name: {
    english: { type: String },
    japanese: { type: String },
    chinese: { type: String },
    french: { type: String }
  },
  type: [String],
  base: {
    HP: { type: Number },
    Attack: { type: Number },
    Defense: { type: Number },
    Sp: {
      Attack: { type: Number },
      Defense: { type: Number },
    },
    Speed: { type: Number },
  },
  species: { type: String },
  description: { type: String },
  profile: {
    height: { type: String },
    weight: { type: String },
    egg: [String],
    ability: [[String]],
    gender: { type: String }, // in form of "%male:%female"
  },
  image: {
    sprite: { type: String },
    thumbnail: { type: String },
    hires: { type: String },
  },
  evolution_chain: [evolutionSchema]
});

// Export Pokemon model
module.exports = mongoose.model('Pokemon', PokemonSchema, 'pokemon');