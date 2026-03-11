import React, { useState } from 'react';
import { Dumbbell, Clock, Activity, AlertCircle, Target } from 'lucide-react';

const WorkoutForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        goal: '',
        experience: 'beginner',
        equipment: 'gym',
        duration: '30',
        limitations: 'none'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form-card slide-up">
            <h2 className="form-heading">
                Customize Your Plan
            </h2>

            <div className="form-grid">
                {/* Goal */}
                <div className="form-group">
                    <label className="form-label">
                        <Target size={18} className="icon-blue" /> Goal
                    </label>
                    <input
                        type="text"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        placeholder="e.g., Build muscle, Lose weight, Run 5k"
                        className="form-input"
                        required
                    />
                </div>

                {/* Experience Level */}
                <div className="form-group">
                    <label className="form-label">
                        <Activity size={18} className="icon-green" /> Experience Level
                    </label>
                    <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                {/* Equipment */}
                <div className="form-group">
                    <label className="form-label">
                        <Dumbbell size={18} className="icon-purple" /> Equipment
                    </label>
                    <select
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="gym">Full Gym Access</option>
                        <option value="dumbbells">Dumbbells Only</option>
                        <option value="home">Bodyweight / Home</option>
                    </select>
                </div>

                {/* Duration */}
                <div className="form-group">
                    <label className="form-label">
                        <Clock size={18} className="icon-yellow" /> Time per Workout
                    </label>
                    <div className="radio-group">
                        {['15', '30', '45', '60'].map((time) => (
                            <label key={time} className="radio-label">
                                <input
                                    type="radio"
                                    name="duration"
                                    value={time}
                                    checked={formData.duration === time}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <div className="radio-button">
                                    {time}m
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Limitations */}
                <div className="form-group full-width">
                    <label className="form-label">
                        <AlertCircle size={18} className="icon-red" /> Limitations / Injuries
                    </label>
                    <input
                        type="text"
                        name="limitations"
                        value={formData.limitations}
                        onChange={handleChange}
                        placeholder="e.g., Lower back pain, None"
                        className="form-input"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
            >
                {isLoading ? (
                    <>
                        <div className="spinner"></div>
                        Generating Plan...
                    </>
                ) : (
                    'Generate Workout Plan'
                )}
            </button>
        </form>
    );
};

export default WorkoutForm;
