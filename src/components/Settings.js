import React from "react";

const Settings = () => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Sound</h3>
        <label>
          <input type="checkbox" /> Enable sound effects
        </label>
      </div>
      <div className="settings-section">
        <h3>Display</h3>
        <label>
          <input type="checkbox" /> Dark mode
        </label>
      </div>
      <div className="settings-section">
        <h3>Difficulty</h3>
        <select>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
