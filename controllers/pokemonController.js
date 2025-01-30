var Pokemon = require('../models/pokemon');

// Return list of all Pokemon.
exports.pokemon_list = function (req, res, next) {
    Pokemon.find()
        .sort([['name', 'ascending']])
        .then((res) => {
            console.log("res is: ", res);
            // Successful, so render.
            res.json({list_pokemon});
        }).catch((err) => {
            return next(err);
        });
};