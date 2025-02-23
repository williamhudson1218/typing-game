import React from "react";

const Achievements = () => {
  return (
    <div className="achievements">
      <h2>Achievements</h2>
      <div className="achievements-grid">
        <div className="achievement-card">
          <h3>Speed Demon</h3>
          <p>Type 60 words per minute</p>
          <span className="status">In Progress</span>
        </div>
        <div className="achievement-card">
          <h3>Perfect Score</h3>
          <p>Complete a lesson with 100% accuracy</p>
          <span className="status">Completed</span>
        </div>
        <div className="achievement-card">
          <h3>Dedicated Learner</h3>
          <p>Complete 5 lessons</p>
          <span className="status">In Progress</span>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
