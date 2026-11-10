const mongoose = require("mongoose");
const Pokemon = require("../models/pokemon");
const PokemonTeam = require("../models/pokemon-team");

const MAX_TEAM_SIZE = 6;
const MAX_NAME_LENGTH = 50;

/**
 * Build a safe team update from the request body. Only `name` and
 * `pokemon_ids` are accepted; everything else (e.g. `user`, `_id`,
 * `$set`) is ignored. Returns { error } when the input is invalid.
 */
function parseTeamInput(body = {}) {
  const team = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.length > MAX_NAME_LENGTH) {
      return { error: `name must be a string of at most ${MAX_NAME_LENGTH} characters` };
    }
    team.name = body.name.trim();
  }
  if (body.pokemon_ids !== undefined) {
    const ids = body.pokemon_ids;
    if (
      !Array.isArray(ids) ||
      ids.length > MAX_TEAM_SIZE ||
      !ids.every((id) => Number.isInteger(id) && id > 0) ||
      new Set(ids).size !== ids.length
    ) {
      return { error: `pokemon_ids must be at most ${MAX_TEAM_SIZE} unique positive integers` };
    }
    team.pokemon_ids = ids;
  }
  return { team };
}

const invalidId = (res) => res.status(404).json({ error: "Not found" });

// Return list of all Pokemon. The data is static, so let browsers cache it.
exports.pokemon_list = async (req, res) => {
  const list_pokemon = await Pokemon.find({}, { __v: 0 })
    .sort({ id: 1 })
    .lean();
  res.set("Cache-Control", "public, max-age=86400");
  res.json({ list_pokemon });
};

// Return all of a user's pokemon teams
exports.pokemon_team = async (req, res) => {
  const teams = await PokemonTeam.find({ user: req.userId }).lean();
  res.json(teams);
};

// Return a user's pokemon team by id
exports.pokemon_team_by_id = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  const team = await PokemonTeam.findOne({ _id: req.params.id, user: req.userId }).lean();
  if (!team) return res.status(404).json({ error: "Not found" });
  res.json(team);
};

// Create a pokemon team for a user
exports.create_pokemon_team = async (req, res) => {
  const { team, error } = parseTeamInput(req.body);
  if (error) return res.status(400).json({ error });
  const newTeam = await PokemonTeam.create({ ...team, user: req.userId });
  res.status(201).json(newTeam);
};

// Update a pokemon team
exports.update_pokemon_team = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  const { team: update, error } = parseTeamInput(req.body);
  if (error) return res.status(400).json({ error });
  const team = await PokemonTeam.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: update },
    { new: true, runValidators: true }
  );
  if (!team) return res.status(404).json({ error: "Not found" });
  res.json(team);
};

// Delete a pokemon team
exports.delete_pokemon_team = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);
  const deleted = await PokemonTeam.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};

// Exported for unit tests.
exports.parseTeamInput = parseTeamInput;
