var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
var pokemon_controller = require('../controllers/pokemonController'); 
var login_controller = require('../controllers/loginController');

// POST request to register a new user
router.post('/register', login_controller.register);
// POST request to login a user
router.post('/login', login_controller.login);
// GET request to return profile information for user
router.get('/profile', auth, login_controller.profile);
// GET request to show pokemon.
router.get('/pokemon', pokemon_controller.pokemon_list);

module.exports = router;