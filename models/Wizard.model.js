const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the Wizard model to whatever makes sense in this case
const WizardSchema = new Schema(
  {
    Wizardname: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    firstYearOfHogwarts: {
      type: Number,
      required: true,
    },
    house: {
      type: String,
      required: true,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Wizard = model("Wizard", WizardSchema);

module.exports = Wizard;
