import { useState } from "react";
import { BackIcon } from "../../MainIcons/SvgIcons";
import "./DriverPanel.css";

export default function DriverPanel({ setRole }) {
  const [driverMode, setDriverMode] = useState(
    () => sessionStorage.getItem("sakuraDriverMode") || "olish"
  );

  const handleBack = () => {
    setRole("");
  };

  const toggleDriverMode = () => {
    setDriverMode((prev) =>
      prev === "olish" ? "yetkazish" : "olish"
    );
  };

  return (
    <div className="driver-panel">
      <div className="driver-fixed-controls">
        <button
          type="button"
          className="driver-back-button"
          onClick={handleBack}
          aria-label="Orqaga"
        >
          <BackIcon className="driver-back-icon"/>
        </button>

        <button
          type="button"
          className="driver-mode-toggle"
          onClick={toggleDriverMode}
        >
          {driverMode === "olish" ? "🚚 Yetkazish" : "📦 Olish"}
        </button>
      </div>

      <div className="driver-panel-content">
        <h2>
          {driverMode === "olish" ? "Olish rejimi" : "Yetkazish rejimi"}
        </h2>
      </div>
    </div>
  );
}