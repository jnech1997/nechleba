let mongoose = require('mongoose');
let { Schema, Types } = mongoose;

const PokemonTeamSchema = new Schema({
  name: { type: String },
  user: { type: Types.ObjectId, ref: 'User', required: true }, // ownership link
  pokemon_ids: [Number]
}, { timestamps: true });

// Export Pokemon Teams model
module.exports = mongoose.model('PokemonTeam', PokemonTeamSchema, 'pokemonteam');