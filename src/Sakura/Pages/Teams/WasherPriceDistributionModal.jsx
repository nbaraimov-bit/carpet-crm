import { useMemo, useState } from "react";
import carpetIcon from "../../MainIcons/carpetIcon.png";
import blanketIcon from "../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../MainIcons/yakandozIcon.png";

const products = [
  { key: "carpetSt", label: "ST", icon: carpetIcon, limit: 1500 },
  { key: "carpetPro", label: "PRO", icon: carpetIcon, limit: 2000 },
  { key: "blanket1x", label: "1x", icon: blanketIcon, limit: 4000 },
  { key: "blanket2x", label: "2x", icon: blanketIcon, limit: 5000 },
  { key: "matras", label: "Matras", icon: blanketIcon, limit: 8000 },
  { key: "yakandozM", label: "M", icon: yakandozIcon, limit: 2000 },
  { key: "yakandozS", label: "S", icon: yakandozIcon, limit: 4000 },
  { key: "yakandozL", label: "L", icon: yakandozIcon, limit: 6000 },
];

const amount = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
};

export default function WasherPriceDistributionModal({
  members,
  onClose,
  onSave,
  saving = false,
}) {
  const [values, setValues] = useState(() => Object.fromEntries(
    members.map(({ key, member }) => [key, Object.fromEntries(
      products.map((product) => [product.key, amount(member[product.key])])
    )])
  ));

  const totals = useMemo(() => Object.fromEntries(products.map((product) => [
    product.key,
    members.reduce((sum, { key }) => sum + amount(values[key]?.[product.key]), 0),
  ])), [members, values]);

  const isValid = members.length > 0 && products.every((product) =>
    totals[product.key] === product.limit
  ) && members.every(({ key }) => products.every((product) => {
    const value = Number(values[key]?.[product.key] ?? 0);
    return Number.isInteger(value) && value >= 0;
  }));

  const changeValue = (phone, productKey, value) => {
    setValues((previous) => ({
      ...previous,
      [phone]: { ...previous[phone], [productKey]: value },
    }));
  };

  return (
    <div className="team-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="team-modal washer-distribution-modal" role="dialog" aria-modal="true" aria-labelledby="washer-distribution-title">
        <button type="button" className="team-modal-close" onClick={onClose} disabled={saving} aria-label="Yopish">×</button>
        <p className="teams-eyebrow">JAMOA ISH HAQI</p>
        <h2 id="washer-distribution-title">Narxlarni taqsimlash</h2>
        <p className="modal-description">Har bir mahsulot bo‘yicha faol a’zolarga ajrating. Jami belgilangan limitga teng bo‘lishi kerak.</p>

        <div className="washer-distribution-limits">
          {products.map((product) => {
            const total = totals[product.key];
            const state = total === product.limit ? "valid" : total > product.limit ? "over" : "under";
            return (
              <div className={`washer-distribution-limit ${state}`} key={product.key}>
                <span className="washer-distribution-product"><img src={product.icon} alt="" />{product.label}</span>
                <strong>{total.toLocaleString("uz-UZ")} / {product.limit.toLocaleString("uz-UZ")} so‘m</strong>
              </div>
            );
          })}
        </div>

        <div className="washer-distribution-members">
          {members.map(({ key, member }) => (
            <article className="washer-distribution-member" key={key}>
              <h3>{member.name || member.phone || key}</h3>
              <div className="washer-distribution-grid">
                {products.map((product) => (
                  <label key={product.key}>
                    <span className="washer-distribution-product"><img src={product.icon} alt="" />{product.label}</span>
                    <div className="washer-money-input">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={values[key]?.[product.key] ?? 0}
                        onChange={(event) => changeValue(key, product.key, event.target.value)}
                      />
                      <small>so‘m</small>
                    </div>
                  </label>
                ))}
              </div>
            </article>
          ))}
          {!members.length && <p className="washer-distribution-empty">Narx taqsimlash uchun faol a’zo yo‘q.</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose} disabled={saving}>Bekor qilish</button>
          <button type="button" className="modal-save" onClick={() => onSave(values)} disabled={!isValid || saving}>
            {saving ? "Saqlanmoqda..." : "Taqsimotni saqlash"}
          </button>
        </div>
      </section>
    </div>
  );
}
