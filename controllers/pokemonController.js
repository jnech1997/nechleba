let Pokemon = require('../models/pokemon');
let PokemonTeam = require('../models/pokemon-team');

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

// Return all a user's pokemon team's 
exports.pokemon_team = async function (req, res, next) {
    const teams = await PokemonTeam.find({ user: req.userId });
    res.json(teams);
}

// Return a user's pokemon team by id
exports.pokemon_team_by_id = async (req, res) => {
  const team = await PokemonTeam.findOne({ _id: req.params.id, user: req.userId });
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
};

// Create a pokemon team for a user
exports.create_pokemon_team = async (req, res) => {
  const newTeam = new PokemonTeam({ ...req.body, user: req.userId });
  await newTeam.save();
  res.status(201).json(newTeam);
}

// Update a pokemon team
exports.update_pokemon_team = async (req, res) => {
  const team = await PokemonTeam.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
}

// Delete a pokemon team
exports.delete_pokemon_team = async (req, res) => {
  const deleted = await PokemonTeam.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.userId 
  });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
}