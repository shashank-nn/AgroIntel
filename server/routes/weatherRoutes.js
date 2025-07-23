const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");
const router = express.Router();

const getWeatherData = async (location, apiKey) => {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
  );

  const temp = data.main.temp;
  const weather = data.weather[0].main;

  let cropSuggestion = "Wheat";
  if (temp > 30) cropSuggestion = "Cotton";
  if (temp < 15) cropSuggestion = "Barley";
  if (weather.includes("Rain")) cropSuggestion = "Rice";

  return {
    location: data.name,
    temperature: temp,
    weather: weather,
    suggestion: cropSuggestion,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    description: data.weather[0].description
  };
};

// Default endpoint
router.get("/", auth, async (req, res) => {
  try {
    const weatherInfo = await getWeatherData("Hyderabad", process.env.OPENWEATHER_KEY);
    res.json(weatherInfo);
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

// Dynamic location endpoint
router.get("/:location", auth, async (req, res) => {
  try {
    const location = req.params.location;
    const weatherInfo = await getWeatherData("Delhi", process.env.OPENWEATHER_KEY);

    res.json(weatherInfo);
  } catch (err) {
    console.error("❌ Weather API error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});


module.exports = router;

