// server/models/Crop.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: String,
  yield: Number,
  health: String, // ⬅️ Add this
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Crop", cropSchema);


