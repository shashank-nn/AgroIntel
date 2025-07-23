const express = require("express");
const Crop = require("../models/Crop");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/crops
// @desc    Add a new crop
// @access  Private
// POST /api/crops
router.post("/", auth, async (req, res) => {
  const { name, yield: cropYield } = req.body;

  let health = "Low";
  if (cropYield >= 25) health = "Healthy";
  else if (cropYield >= 15) health = "Moderate";

  try {
    const crop = new Crop({
      name,
      yield: cropYield,
      health,
      userId: req.user.id,
    });
    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: "Failed to add crop" });
  }
});

// @route   GET /api/crops
// @desc    Get all crops for the user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crops" });
  }
});

module.exports = router;

