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
    Ingredients: {
      type: [String],
      required: true,
    },
    Method: {
      type: String,
      required: true,
    },
    PotionTime: {
      type:Number,
      required:false
    },
    Difficulty: {
      type: String,
      required: false
    },
    SideEffects: {
      type:String,
      required: false
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Potion = model("Potion", PotionSchema);

module.exports = Potion;
