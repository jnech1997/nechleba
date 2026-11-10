const express = require("express");
const auth = require("../middleware/auth");
const { authLimiter, refreshLimiter, contactLimiter } = require("../middleware/rateLimit");
const pokemon_controller = require("../controllers/pokemonController");
const login_controller = require("../controllers/loginController");
const email_controller = require("../controllers/emailController");

const router = express.Router();

// POST request to register a new user
router.post("/signup", authLimiter, login_controller.signup);
// POST request to login a user
router.post("/login", authLimiter, login_controller.login);
// POST request to refresh a user's access token
router.post("/refresh", refreshLimiter, login_controller.refresh);
// POST request to logout a user
router.post("/logout", login_controller.logout);
// GET request to return profile information for user
router.get("/profile", auth, login_controller.profile);
// DELETE request to delete the user's account
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
router.post("/contact", contactLimiter, email_controller.sendEmail);

module.exports = router;
