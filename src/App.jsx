import React, { useState } from 'react';
import { generateWorkoutPlan } from './api/gemini';
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
      const planData = await generateWorkoutPlan(formData);
      setPlan(planData);
    } catch (err) {
      console.error('Plan generation error:', err);
      setError(err.message || 'Failed to generate plan. Please try again.');
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
