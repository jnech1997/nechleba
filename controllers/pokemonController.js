var Pokemon = require('../models/pokemon');

// Return list of all Pokemon.
exports.pokemon_list = function (req, res, next) {
    Pokemon.find()
        .then((res) => {
            // Successful, so render.
            console.log(res);
            res.json({res});
        }).catch((err) => {
            return next(err);
        });
        // 
        // .sort([['name', 'ascending']])
        // .exec(function (err, list_pokemon) {
        //     if (err) { return next(err); }
        //     // Successful, so render.
        //     res.json({list_pokemon});
        // })
};