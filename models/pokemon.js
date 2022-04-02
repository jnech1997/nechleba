var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PokemonSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    img: { type: String, required: true, maxLength: 100 },
});

// Export model.
module.exports = mongoose.model('Pokemon', PokemonSchema);