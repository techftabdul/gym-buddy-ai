import React from 'react';
import { Flame, Dumbbell, Wind, Info } from 'lucide-react';

const DayCard = ({ dayData }) => {
    if (dayData.isRest) {
        return (
            <div className="day-card rest-day fade-in-up">
                <div className="rest-day-content">
                    <div className="rest-icon">😴</div>
                    <h3 className="rest-title">Rest Day</h3>
                    <p className="rest-text">Recovery is when your muscles grow. Stay hydrated, stretch lightly, and let your body rebuild stronger.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="day-card fade-in-up">
            {/* Focus Badge */}
            <div className="day-focus-badge">
                <Dumbbell size={14} />
                <span>{dayData.focus}</span>
            </div>

            {/* Warm-up Section */}
            {dayData.warmup && dayData.warmup.length > 0 && (
                <div className="day-section">
                    <div className="section-header warmup-header">
                        <Flame size={18} className="section-icon warmup-icon" />
                        <h3 className="section-title">Warm-up</h3>
                    </div>
                    <ul className="warmup-list">
                        {dayData.warmup.map((item, index) => (
                            <li key={index} className="warmup-item slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <span className="warmup-dot"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Exercises Section */}
            {dayData.exercises && dayData.exercises.length > 0 && (
                <div className="day-section">
                    <div className="section-header exercises-header">
                        <Dumbbell size={18} className="section-icon exercises-icon" />
                        <h3 className="section-title">Workout</h3>
                    </div>
                    <div className="exercise-list">
                        {dayData.exercises.map((exercise, index) => (
                            <div key={index} className="exercise-row slide-in" style={{ animationDelay: `${index * 0.06}s` }}>
                                <div className="exercise-info">
                                    <span className="exercise-number">{index + 1}</span>
                                    <div className="exercise-details">
                                        <span className="exercise-name">{exercise.name}</span>
                                        {exercise.notes && (
                                            <span className="exercise-note">
                                                <Info size={12} />
                                                {exercise.notes}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="exercise-badges">
                                    <span className="badge badge-sets">{exercise.sets} sets</span>
                                    <span className="badge badge-reps">{exercise.reps} reps</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cool-down Section */}
            {dayData.cooldown && dayData.cooldown.length > 0 && (
                <div className="day-section">
                    <div className="section-header cooldown-header">
                        <Wind size={18} className="section-icon cooldown-icon" />
                        <h3 className="section-title">Cool-down</h3>
                    </div>
                    <ul className="warmup-list">
                        {dayData.cooldown.map((item, index) => (
                            <li key={index} className="warmup-item slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <span className="cooldown-dot"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DayCard;
