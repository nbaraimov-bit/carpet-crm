import { useEffect, useState } from "react";
import "./DriverPickupModal.css";

export default function DriverPickupModal({
  order,
  form,
  onClose,
  onFieldChange,
  onSave,
  saving = false,
}) {
  const [locationPrompt, setLocationPrompt] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setLocationPrompt(false);
    setLocating(false);
  }, [order?.firebaseId]);

  if (!order) return null;

  const requestSave = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationPrompt(true);
      return;
    }

    setLocating(true);
    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocating(false);
          onSave(`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`);
        },
        () => {
          setLocating(false);
          setLocationPrompt(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } catch {
      setLocating(false);
      setLocationPrompt(true);
    }
  };

  const input = (name, label, placeholder, options = {}) => (
    <label>
      {label}
      <input
        type="number"
        min="0"
        value={form[name]}
        onChange={(event) => onFieldChange(name, event.target.value)}
        placeholder={placeholder}
        {...options}
      />
    </label>
  );

  return (
    <div className="driver-pickup-modal-overlay" onClick={onClose}>
      <div
        className="driver-pickup-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="driver-pickup-modal__header">
          <div>
            <h2>Ma’lumot kiritish</h2>
            <p>Buyurtma #{order.id}</p>
          </div>
          <button
            type="button"
            className="driver-pickup-modal__close"
            onClick={onClose}
            aria-label="Yopish"
          >
            ×
          </button>
        </div>

        <div className="driver-pickup-form">
          {input("carpetCount", "Gilam soni", "Gilam soni")}
          <div className="driver-pickup-form__two">
            {input("kvmst", "KVM (ST)", "ST kv.m", { step: "any" })}
            {input("kvmpro", "KVM (PRO)", "PRO kv.m", { step: "any" })}
          </div>
          <div className="driver-pickup-form__three">
            {input("blanketCount", "Adyol (1x)", "Adyol (1x)")}
            {input("blanketCount2", "Adyol (2x)", "Adyol (2x)")}
            {input("mattressCount", "Matras", "Matras")}
          </div>
          <div className="driver-pickup-form__three">
            {input("yakandozM", "Yakandoz M", "M")}
            {input("yakandozS", "Yakandoz S", "S")}
            {input("yakandozL", "Yakandoz L", "L")}
          </div>
          <label>
            Izoh
            <textarea
              rows="3"
              value={form.driverComment}
              onChange={(event) =>
                onFieldChange("driverComment", event.target.value)
              }
              placeholder="Qo‘shimcha izoh..."
            />
          </label>
          {input("price", "Jami narx", "Jami narx")}
        </div>

        <div className="driver-pickup-modal__actions">
          <button
            type="button"
            className="driver-pickup-secondary-button"
            onClick={onClose}
            disabled={saving || locating}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="driver-pickup-primary-button"
            onClick={requestSave}
            disabled={saving || locating}
          >
            {saving ? "Saqlanmoqda..." : locating ? "Joylashuv olinmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>

      {locationPrompt && (
        <div className="driver-location-prompt-overlay">
          <div
            className="driver-location-prompt"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="driver-location-prompt-title"
          >
            <p id="driver-location-prompt-title">
              Joylashuv olib bo‘lmadi, GPS o‘chiq bo‘lishi mumkin. Davom etasizmi?
            </p>
            <div className="driver-pickup-modal__actions">
              <button
                type="button"
                className="driver-pickup-secondary-button"
                onClick={() => setLocationPrompt(false)}
                disabled={saving}
              >
                Yo‘q
              </button>
              <button
                type="button"
                className="driver-pickup-primary-button"
                onClick={() => {
                  setLocationPrompt(false);
                  onSave(null);
                }}
                disabled={saving}
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
