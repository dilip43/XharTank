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
  .then(() => {
    console.log("connected to Mongo db database");
  })
  .catch((err) => {
    console.log("Error connecting to database" + err);
  });

app.post("/pitches/:pitch_id/makeOffer", async (req, res) => {
  const pitch = await Pitch.findById(req.params.pitch_id);
  var offer = req.body;
  var counterOffer = new Offer(offer);
  counterOffer.save((err, counterOffer) => {
    if (err) return res.status(400).send("pitch not found");
    else {
      pitch.offers.push(counterOffer.id);
      pitch.save();
      return res.status(201).json({ id: counterOffer.id });
    }
  });
});

//working

app.post("/pitches", (req, res) => {
  var pitch = new Pitch(req.body);
  pitch.save((err, pitch) => {
    if (err) return res.status(400).send(err);
    return res.status(201).json({ id: pitch.id });
  });
});

app.get("/pitches/:pitch_id", async (req, res) => {
  try {
    var fpitch = await Pitch.findById(req.params.pitch_id).select({__v:0,createdAt:0,updatedAt:0}).populate("offers");
    fpitch = JSON.parse(JSON.stringify(fpitch).replaceAll("_id", "id"));
    console.log(fpitch);
    res.status(200).json(fpitch);
  } catch (e) {
    console.log("something went wrong: " + e);
    res.status(404).json({ error: "pitch not found" });
  }
});

app.get("/pitches", async (req, res) => {
  try {
    const pitches = await Pitch.find({}).populate("offers");
    const sortPitches = pitches.sort((x, y) => y.timestamp - x.timestamp);
    res.status(200).json(sortPitches);
  } catch (e) {
    console.log("something went wrong: " + e);
    res.status(404).json({ error: "pitch not found" });
  }
});

app.listen(8081, () => {
  console.log("Backend server has started at port:" + 8081);
});
