var mongoose = require('mongoose');

var PokemonSchema = new mongoose.Schema({
    name: { type: String },
    img: { type: String },
});

// Export Pokemon model
module.exports = mongoose.model('Pokemon', PokemonSchema, 'pokemon');