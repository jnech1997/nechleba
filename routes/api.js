var express = require("express");
const auth = require("../middleware/auth");
var router = express.Router();
var pokemon_controller = require("../controllers/pokemonController");
var login_controller = require("../controllers/loginController");
let email_controller = require("../controllers/emailController");

// POST request to register a new user
router.post("/signup", login_controller.signup);
// POST request to login a user
router.post("/login", login_controller.login);
// POST request to refresh a user
router.post("/refresh", login_controller.refresh);
// POST request to logout a user
router.post("/logout", login_controller.logout);
// GET request to return profile information for user
router.get("/profile", auth, login_controller.profile);
// DELETE request to return profile information for user
router.delete("/profile", auth, login_controller.delete_user);

// GET request to show all pokemon data
router.get("/pokemon", pokemon_controller.pokemon_list);
// GET request to show all user's pokemon teams
router.get("/pokemonteam", auth, pokemon_controller.pokemon_team);
// GET request to show user's specific pokemon team
router.get("/pokemonteam/:id", auth, pokemon_controller.pokemon_team_by_id);
// POST request to create a new pokemon team
router.post("/pokemonteam", auth, pokemon_controller.create_pokemon_team);
// PUT request to update a user's pokemon team
router.put("/pokemonteam/:id", auth, pokemon_controller.update_pokemon_team);
// DELETE request to delete a user's team
router.delete("/pokemonteam/:id", auth, pokemon_controller.delete_pokemon_team);

// POST request to send email message
router.post("/contact", email_controller.sendEmail);

module.exports = router;
