import React, { useState } from 'react';
import axios from 'axios';
import WorkoutForm from './components/WorkoutForm';
import WorkoutPlan from './components/WorkoutPlan';
import './index.css';

function App() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/generate-plan', formData);
      setPlan(response.data.plan);
    } catch (err) {
      console.log("SERVER ERROR DATA:", err.response?.data);
      console.log("FULL ERROR:", err);
      console.error(err);

      let errorMessage;
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running: node server.js';
      } else if (err.response?.data?.error) {
        errorMessage = `Server error: ${err.response.data.error}`;
      } else {
        errorMessage = 'Failed to generate plan. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Background Ambience */}
      <div className="app-background">
        <div className="blob blob-blue"></div>
        <div className="blob blob-purple"></div>
      </div>

      <div className="content-wrapper">
        {!plan ? (
          <div className="fade-in-up">
            <div className="hero-header">
              <h1 className="hero-title">
                <span className="text-gradient">GYM</span>
                <span>BUDDY</span>
              </h1>
              <p className="hero-subtitle">Your AI-Powered Personal Trainer</p>
            </div>

            <WorkoutForm onSubmit={handleGeneratePlan} isLoading={isLoading} />

            {error && (
              <div className="error-message shake">
                {error}
              </div>
            )}
          </div>
        ) : (
          <WorkoutPlan plan={plan} onReset={handleReset} />
        )}
      </div>
      <div className="footer">
        <p className="text-footer">Built with ❤️ by <a href="https://x.com/techftabdul">Abdul</a></p>
      </div>
    </div>
  );
}

export default App;
