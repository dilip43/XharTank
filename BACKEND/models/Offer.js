const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema({
  investor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  equity: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
