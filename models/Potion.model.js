const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the Wizard model to whatever makes sense in this case
const PotionSchema = new Schema(
  {
    potionName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    potionTime: {
      type: Number,
      required: false,
    },
    difficulty: {
      type: String,
      required: false,
    },
    wizard: {
      type: Schema.Types.ObjectId,
      ref: "Wizard",
      required: true,
    },
    sideEffects: {
      type: String,
      required: false,
    },
    numberOfLikes: [{
      type: Schema.Types.ObjectId,
      ref: "Wizard",
      required: false,
    }],
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Potion = model("Potion", PotionSchema);

module.exports = Potion;
