import React, { useState, useEffect } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    sound: true,
    darkMode: false,
    allowMistakes: true,
    difficulty: "medium",
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
    setSettings((prev) => ({ ...prev, ...savedSettings }));
  }, []);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Sound</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => handleSettingChange("sound", e.target.checked)}
          />{" "}
          Enable sound effects
        </label>
      </div>
      <div className="settings-section">
        <h3>Display</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
          />{" "}
          Dark mode
        </label>
      </div>
      <div className="settings-section">
        <h3>Typing Behavior</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.allowMistakes}
            onChange={(e) =>
              handleSettingChange("allowMistakes", e.target.checked)
            }
          />{" "}
          Allow typing mistakes
        </label>
      </div>
      <div className="settings-section">
        <h3>Difficulty</h3>
        <select
          value={settings.difficulty}
          onChange={(e) => handleSettingChange("difficulty", e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
