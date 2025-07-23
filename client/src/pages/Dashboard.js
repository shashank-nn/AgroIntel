// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Optional: Create this for extra styles if needed

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeather = async () => {
      console.log("Token being used:", token);
      try {
        const res = await axios.get('/api/weather/Delhi', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWeather(res.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    const fetchCrops = async () => {
      try {
        const res = await axios.get('/api/crops', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCrops(res.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchWeather();
    fetchCrops();
  }, [token]);

  const handlePredict = async (cropName) => {
    try {
      const res = await axios.post(
        '/api/ai/predict',
        { crop: cropName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPredictions((prev) => ({ ...prev, [cropName]: res.data.prediction }));
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');

    try {
      const res = await axios.post(
        '/api/ai/ask',
        { message: chatInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reply = { role: 'assistant', content: res.data.reply };
      setChatMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error('Chat failed:', error);
    }
  };

  return (
    <div className="container mt-4 dashboard-container">
      <h2 className="text-center mb-4">
        <i className="bi bi-flower2 me-2"></i>AgroIntel Dashboard
      </h2>

      {/* Weather Summary */}
      <div className="card mx-auto mb-4 shadow-sm" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-success">
            <i className="bi bi-cloud-sun me-2"></i> Weather Summary
          </h5>
          {weather ? (
            <>
              <p className="card-text">🌡️ Temperature: {weather.temp}°C</p>
              <p className="card-text">💧 Humidity: {weather.humidity}%</p>
              <p className="card-text">💨 Wind: {weather.wind} km/h</p>
              <p className="card-text">🌤️ Condition: {weather.description}</p>
            </>
          ) : (
            <p className="text-muted">Loading weather data...</p>
          )}
        </div>
      </div>

      {/* Crop Cards */}
      <div className="row mt-4 gy-4">
  {crops.map((crop, idx) => (
    <div className="col-sm-6 col-md-4" key={idx}>
      <div className="card h-100 shadow-sm text-center">
        <div className="card-body">
          <h5 className="card-title fw-bold text-success">{crop.name}</h5>
          <p className="card-text mb-1">🌾 <strong>Yield:</strong> {crop.yield} Q/acre</p>
          <p className="card-text mb-2">
            ❤️ <strong>Health:</strong>{" "}
            <span className={`fw-semibold ${
              crop.health === "Healthy" ? "text-success" :
              crop.health === "Moderate" ? "text-warning" : "text-danger"
            }`}>
              {crop.health}
            </span>
          </p>
          <button
            className="btn btn-outline-success btn-sm mb-2"
            onClick={() => handlePredict(crop)}
          >
            Predict Yield
          </button>

          {crop.predicted && (
            <div className="alert alert-danger py-2 px-3 m-0">
              🌟 Predicted: <strong>{crop.predicted} Q/acre</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>


      {/* AI Assistant Chat Button */}
      <div className="fixed-bottom text-end p-3">
        <button className="btn btn-outline-secondary" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? 'Close Assistant' : 'Open AI Assistant'}
        </button>
      </div>

      {/* AI Assistant Chat Modal */}
      {chatOpen && (
        <div
          className="position-fixed bottom-0 end-0 bg-light border p-3 rounded shadow-lg"
          style={{ width: '300px', height: '400px', zIndex: 999 }}
        >
          <h6 className="mb-2">🧠 AI Assistant</h6>
          <div className="overflow-auto mb-2 p-1 bg-white rounded" style={{ maxHeight: '250px' }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`text-${msg.role === 'user' ? 'primary' : 'dark'} mb-1`}>
                {msg.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit}>
            <input
              className="form-control mb-2"
              placeholder="Ask something..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className="btn btn-primary w-100" type="submit">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


