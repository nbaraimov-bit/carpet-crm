import "./DriverPickupModal.css";

export default function DriverPickupModal({
  order,
  form,
  onClose,
  onFieldChange,
}) {
  if (!order) return null;

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
          {input("blanketCount", "Adyol soni", "Adyol")}
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
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="driver-pickup-primary-button"
            onClick={() => {
              console.log("Driver form:", { orderId: order.firebaseId, form });
            }}
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
