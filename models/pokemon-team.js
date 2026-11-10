const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const PokemonTeamSchema = new Schema(
  {
    name: { type: String, maxlength: 50 },
    user: { type: Types.ObjectId, ref: "User", required: true, index: true }, // ownership link
    pokemon_ids: {
      type: [Number],
      validate: {
        validator: (ids) => ids.length <= 6,
        message: "A team can have at most 6 pokemon",
      },
    },
  },
  { timestamps: true }
);

// Export Pokemon Teams model
module.exports = mongoose.model("PokemonTeam", PokemonTeamSchema, "pokemonteam");
