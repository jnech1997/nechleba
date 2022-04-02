var express = require('express');
var router = express.Router();

var pokemon_controller = require('../controllers/pokemonController'); 

// GET request to delete Book.
router.get('/api/pokemon', pokemon_controller.pokemon_list);

module.exports = router;