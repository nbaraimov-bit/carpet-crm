import { useState } from "react";
import { BackIcon } from "../../MainIcons/SvgIcons";
import "./DriverPanel.css";

import DriverPickupMode from "./DriverPickupMode/DriverPickupMode";
import DriverDeliveryMode from "./DriverDeliveryMode/DriverDeliveryMode";

export default function DriverPanel({ 
  setRole,
  orders,
  driverTeam,
  loading,
  runAction,
  calculateTotalSalary,
  washerPrices,
  driverPrices,
  packingPrices,
  updateExpenseFund,
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
            loading={loading}
            runAction={runAction}
          />
        )}

        {driverMode === "yetkazish" && (
          <DriverDeliveryMode
            orders={orders}
            driverTeam={driverTeam}
            loading={loading}
            runAction={runAction}
            calculateTotalSalary={calculateTotalSalary}
            washerPrices={washerPrices}
            driverPrices={driverPrices}
            packingPrices={packingPrices}
            updateExpenseFund={updateExpenseFund}
          />
        )}
      </div>
    </div>
  );
}
