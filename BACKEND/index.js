const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const Pitch = require("./models/Pitch");
const Offer = require("./models/Offer");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/xharktank")
  .then(async () => {
    console.log("connected to Mongo db database");
    await Pitch.deleteMany({});
    await Offer.deleteMany({});
  })
  .catch((err) => {
    console.log("Error connecting to database" + err);
  });

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

app.get("/pitches/:pitch_id", async (req, res) => {
  try {
    var fpitch = await Pitch.findById(req.params.pitch_id)
      .select({ __v: 0, createdAt: 0, updatedAt: 0 })
      .populate("offers", { __v: 0 });

    if (!pitches) return res.status(200).json([]);

    res.status(200).json(fpitch);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: "pitch not found" });
  }
});

app.get("/pitches", async (req, res) => {
  try {
    pitches = await Pitch.find(
      {},
      { __v: 0, createdAt: 0, updatedAt: 0 }
    ).populate("offers", { __v: 0 });

    if (!pitches) return res.status(200).json([]);

    var result = pitches.reverse();

    return res.status(200).json(rseult);
  } catch (e) {
    console.log("something went wrong: " + e);
    return res.status(404).json({ error: "pitch not found" });
  }
});

// working
app.post("/pitches", (req, res) => {
  var { entrepreneur, pitchTitle, pitchIdea, askAmount, equity } = req.body;

  if (
    entrepreneur == "" &&
    pitchTitle == "" &&
    pitchIdea == "" &&
    askAmount === null &&
    equity === null
  )
    return res.status(400).json("Request body is empty");
  else if (
    entrepreneur == "" ||
    entrepreneur === null ||
    pitchTitle === null ||
    pitchTitle == "" ||
    pitchIdea == "" ||
    pitchIdea === null ||
    askAmount === null ||
    equity === null ||
    equity > 100
  )
    return res.status(400).json("invalid fields value");

  var pitch = new Pitch(req.body);
  pitch.save((err, pitch) => {
    if (err) return res.status(400).json(err);
    return res.status(201).json({ id: pitch.id });
  });
});

app.post("/pitches/:pitch_id/makeOffer", async (req, res) => {
  var { investor, amount, equity, comment } = req.body;

  if (investor == "" && amount === null && equity === null && comment == "")
    return res.status(400).json("Request body is empty");
  else if (
    investor == "" ||
    investor === null ||
    amount === null ||
    equity === null ||
    equity > 100 ||
    comment == "" ||
    comment === null
  )
    return res.status(400).json("invalid fields value");

  pitch = await Pitch.findById(req.params.pitch_id);
  offer = req.body;
  var counterOffer = new Offer(offer);
  counterOffer.save((err, counterOffer) => {
    if (err) return res.status(404).json("pitch not found");
    else {
      pitch.offers.push(counterOffer.id);
      pitch.save();
      return res.status(201).json({ id: counterOffer.id });
    }
  });
});

app.listen(8081, () => {
  console.log("Backend server has started at port:" + 8081);
});
