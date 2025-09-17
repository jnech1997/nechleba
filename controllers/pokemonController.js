var Pokemon = require('../models/pokemon');

// Return list of all Pokemon.
exports.pokemon_list = function (req, res, next) {
    Pokemon.find({}, null, {sort: {id: 1}})
        .then((list_pokemon) => {
            // Successful, so render.
            res.json({list_pokemon});
        }).catch((err) => {
            return next(err);
        });
};