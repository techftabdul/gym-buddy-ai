import React, { useState } from 'react';
import { RefreshCw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import DayCard from './DayCard';

const WorkoutPlan = ({ plan, onReset }) => {
    const [activeDay, setActiveDay] = useState(0);

    if (!plan || !plan.days) return null;

    const currentDay = plan.days[activeDay];

    return (
        <div className="plan-container fade-in">
            {/* Plan Header */}
            <div className="plan-hero">
                <button onClick={onReset} className="btn-back" title="Create New Plan">
                    <RefreshCw size={16} />
                    <span>New Plan</span>
                </button>
                <h1 className="plan-title">{plan.title}</h1>
                <p className="plan-summary">{plan.summary}</p>
            </div>

            {/* Day Navigation Tabs */}
            <div className="day-tabs-wrapper">
                <div className="day-tabs">
                    {plan.days.map((day, index) => (
                        <button
                            key={index}
                            className={`day-tab ${activeDay === index ? 'day-tab-active' : ''} ${day.isRest ? 'day-tab-rest' : ''}`}
                            onClick={() => setActiveDay(index)}
                        >
                            <span className="day-tab-number">{day.day}</span>
                            <span className="day-tab-label">{day.label}</span>
                            {!day.isRest && <span className="day-tab-focus">{day.focus}</span>}
                            {day.isRest && <span className="day-tab-focus">Rest</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day Navigation Arrows (Mobile) */}
            <div className="day-nav-arrows">
                <button
                    className="nav-arrow"
                    onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
                    disabled={activeDay === 0}
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="nav-current">
                    {currentDay.day} — {currentDay.label}
                </span>
                <button
                    className="nav-arrow"
                    onClick={() => setActiveDay(Math.min(plan.days.length - 1, activeDay + 1))}
                    disabled={activeDay === plan.days.length - 1}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Active Day Content */}
            <div className="day-content" key={activeDay}>
                <DayCard dayData={currentDay} />
            </div>

            {/* Motivational Quote */}
            {plan.motivation && (
                <div className="motivation-card slide-up">
                    <Sparkles size={20} className="motivation-icon" />
                    <p className="motivation-text">{plan.motivation}</p>
                </div>
            )}

            {/* Footer */}
            <div className="plan-bottom-footer">
                <p className="disclaimer">Always consult with a professional before starting a new exercise program and using a new machine.</p>
            </div>
        </div>
    );
};

export default WorkoutPlan;
