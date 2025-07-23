// routes/aiRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

// Dummy prediction logic (replace with actual ML model if needed)
router.post("/predict", auth, async (req, res) => {
  const { crop } = req.body;
  try {
    // Simulate prediction
    const prediction = `${Math.floor(Math.random() * 20 + 20)} Q/acre`;
    res.json({ prediction });
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;


