var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PokemonSchema = new Schema({
    name: { type: String },
    img: { type: String },
});

// Export model.
module.exports = mongoose.model('Pokemon', PokemonSchema, 'pokemon');