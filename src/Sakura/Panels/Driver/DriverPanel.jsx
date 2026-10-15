import { useState } from "react";
import { BackIcon } from "../../MainIcons/SvgIcons";
import "./DriverPanel.css";

import DriverPickupMode from "./DriverPickupMode/DriverPickupMode";

export default function DriverPanel({ 
  setRole,
  orders,
  driverTeam,
  updateStatus,
  loading,
  runAction,
}) {
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
        {driverMode === "olish" && (
          <DriverPickupMode
            orders={orders}
            driverTeam={driverTeam}
            updateStatus={updateStatus}
            loading={loading}
            runAction={runAction}
          />
        )}

        {driverMode === "yetkazish" && (
          <div className="driver-placeholder">
            <h2>Yetkazish rejimi</h2>
            <p>Bu bo‘limni keyingi bosqichda yaratamiz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
