const mongoose = require("mongoose");

const Offer = require("./Offer");
const pitchSchema = new mongoose.Schema(
  {
    entrepreneur: {
      type: String,
      required: true,
    },
    pitchTitle: {
      type: String,
      required: true,
    },
    pitchIdea: {
      type: String,
      required: true,
    },
    askAmount: {
      type: Number,
      required: true,
    },
    equity: {
      type: Number,
      required: true,
    },
    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
  },
  { timestamps: true }
);

const Pitch = mongoose.model("Pitch", pitchSchema);
module.exports = Pitch;
