var Pokemon = require('../models/pokemon');

// Return list of all Pokemon.
exports.pokemon_list = function (req, res, next) {
    Pokemon.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_pokemon) {
            if (err) { return next(err); }
            // Successful, so render.
            res.json({list_pokemon});
        })
};