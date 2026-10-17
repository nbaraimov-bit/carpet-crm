import { useMemo, useState } from "react";
import carpetIcon from "../../MainIcons/carpetIcon.png";
import blanketIcon from "../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../MainIcons/yakandozIcon.png";
import { BackIcon, CommentIcon, LocationIcon, PhoneIcon, UserIcon } from "../../MainIcons/SvgIcons";
import "./packingPanel.css";

const products = [
  { key: "carpet", title: "Gilam", statusField: "carpetStatus", icon: carpetIcon },
  { key: "blanket", title: "Adyol", statusField: "blanketStatus", icon: blanketIcon },
  { key: "yakandoz", title: "Yakandoz", statusField: "yakandozStatus", icon: yakandozIcon },
];

const number = (value) => Number(value || 0);
const formatMoney = (value) => `${Math.round(number(value)).toLocaleString("uz-UZ")} so'm`;

function getProductInfo(order, key) {
  if (key === "carpet") {
    const hasSizes = number(order.kvmSt) + number(order.kvmPro) > 0;
    const st = hasSizes ? number(order.kvmSt) : number(order.kvm);
    const pro = hasSizes ? number(order.kvmPro) : 0;
    const count = number(order.carpetCount);
    return {
      count: count ? `${count} / ${st + pro}` : `${st + pro}`,
      confirmationCount: count ? `${count} ta gilam` : `${st + pro} kvm gilam`,
      salary: (st + pro) * 300,
    };
  }

  if (key === "blanket") {
    const hasSizes = number(order.blanket1x) + number(order.blanket2x) + number(order.matras) > 0;
    const oneX = hasSizes ? number(order.blanket1x) : number(order.blanketCount);
    const twoX = hasSizes ? number(order.blanket2x) : 0;
    const matras = hasSizes ? number(order.matras) : 0;
    return {
      count: `${oneX + twoX + matras}`,
      confirmationCount: `${oneX + twoX + matras} ta adyol`,
      salary: oneX * 800 + twoX * 1000 + matras * 2000,
    };
  }

  const hasSizes = number(order.yakandozM) + number(order.yakandozS) + number(order.yakandozL) > 0;
  const sizeM = hasSizes ? number(order.yakandozM) : number(order.yakandozCount);
  const sizeS = hasSizes ? number(order.yakandozS) : 0;
  const sizeL = hasSizes ? number(order.yakandozL) : 0;
  return {
    count: `${sizeM + sizeS + sizeL}`,
    confirmationCount: `${sizeM + sizeS + sizeL} ta yakandoz`,
    salary: sizeM * 500 + sizeS * 1000 + sizeL * 1500,
  };
}

function hasProduct(order, key) {
  if (key === "carpet") return number(order.carpetCount) + number(order.kvmSt) + number(order.kvmPro) + number(order.kvm) > 0;
  if (key === "blanket") return number(order.blanket1x) + number(order.blanket2x) + number(order.matras) + number(order.blanketCount) > 0;
  return number(order.yakandozM) + number(order.yakandozS) + number(order.yakandozL) + number(order.yakandozCount) > 0;
}

export default function PackingPanel({ orders = [], packingTeam, updatePackingStatus, setRole }) {
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const teamId = packingTeam?.id;

  const visibleOrders = useMemo(() => orders
    .filter((order) => order.status !== "Tayyor" && order.status !== "Yetkazildi")
    .map((order) => ({
      ...order,
      presentProducts: products.filter((product) => hasProduct(order, product.key)),
    }))
    .filter((order) =>
      order.presentProducts.some((product) => ["Yuvildi", "Tayyor"].includes(order[product.statusField]))
      && order.presentProducts.some((product) => order[product.statusField] !== "Tayyor")
    )
    .sort((first, second) => {
      const firstIsQuick = first.tarif === "tezkor";
      const secondIsQuick = second.tarif === "tezkor";
      if (firstIsQuick !== secondIsQuick) return firstIsQuick ? -1 : 1;
      return String(first.id ?? "").localeCompare(String(second.id ?? ""), undefined, { numeric: true });
    }), [orders]);

  const confirmProduct = async () => {
    if (!confirmation || !teamId) return;
    const { order, product } = confirmation;
    const actionKey = `packing-${product.key}-${order.firebaseId}`;
    setNotice("");
    setSavingKey(actionKey);
    try {
      await updatePackingStatus(order.firebaseId, product.key);
      setConfirmation(null);
    } catch (error) {
      setNotice(error.message || "Mahsulot holatini saqlab bo'lmadi");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <main className="packing-page">
      <button type="button" className="packing-back-button" onClick={() => setRole?.("")} aria-label="Bosh menyuga qaytish">
        <BackIcon className="packing-back-icon" />
      </button>
      <header className="packing-page-header">
        <div>
          <span className="packing-eyebrow">TAYYORLOVCHI PANEL</span>
          <h1>Tayyorlash buyurtmalari</h1>
          <p>{packingTeam?.teamName || "Faol tayyorlovchi jamoa tanlanmagan"}</p>
        </div>
      </header>

      {notice && <div className="packing-notice" role="alert">{notice}</div>}
      {!packingTeam && <div className="packing-empty">Buyurtmalarni bajarish uchun faol tayyorlovchi jamoaga a'zo bo'ling.</div>}
      {packingTeam && visibleOrders.length === 0 && <div className="packing-empty">Hozircha tayyorlanadigan buyurtma yo'q.</div>}

      <section className="packing-orders">
        {visibleOrders.map((order) => (
          <article className={`packing-order-card ${order.tarif === "tezkor" ? "quick" : ""}`} key={order.firebaseId || order.id}>
            <header className="packing-order-header">
              <div className="packing-order-id">{order.id}</div>
              <span className={`packing-order-status ${order.tarif === "tezkor" ? "quick" : ""}`}>
                {order.tarif === "tezkor" ? "Tezkor" : order.status || "Yuvildi"}
              </span>
            </header>

            <div className="packing-order-details">
              <div className="packing-info-row"><UserIcon /><span>{order.customerId || "Mijoz"}</span></div>
              {order.phone && <a className="packing-info-row" href={`tel:${order.phone}`}><PhoneIcon /><span>{order.phone}</span></a>}
              {order.address && <div className="packing-info-row"><LocationIcon /><span>{order.address}</span></div>}
            </div>

            {(order.comment || order.driverComment) && (
              <div className="packing-comment">
                <CommentIcon />
                <div>
                  {order.comment && <p>{order.comment}</p>}
                  {order.driverComment && <p>{order.driverComment}</p>}
                </div>
              </div>
            )}

            <div className="packing-products">
              {products.map((product) => {
                const info = getProductInfo(order, product.key);
                const present = hasProduct(order, product.key);
                const completed = order[product.statusField] === "Tayyor";
                const washed = completed || order[product.statusField] === "Yuvildi";
                const actionKey = `packing-${product.key}-${order.firebaseId}`;
                const busy = savingKey === actionKey;
                return (
                  <div className={`packing-product ${present ? "active" : "inactive"} ${completed ? "completed" : ""}`} key={product.key}>
                    <div className="packing-product-quantity">
                      <img src={product.icon} alt={product.title} />
                      {present && <span>{info.count}</span>}
                      <i className={completed ? "is-done" : ""} />
                    </div>
                    <button
                      type="button"
                      className={`packing-done-button ${!washed || completed ? "waiting" : ""}`}
                      disabled={busy || !teamId || !present || !washed || completed}
                      onClick={() => setConfirmation({ order, product, info })}
                    >
                      {busy ? "Kuting..." : completed ? "Tayyor" : washed ? "Tayyor" : "Yuvilmoqda"}
                    </button>
                    {present && <small className="packing-product-salary">{formatMoney(info.salary)}</small>}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      {confirmation && (
        <div className="packing-confirm-overlay" onClick={() => setConfirmation(null)}>
          <section className="packing-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="packing-confirm-title" onClick={(event) => event.stopPropagation()}>
            <span className="packing-eyebrow">TASDIQLASH</span>
            <h2 id="packing-confirm-title">
              {confirmation.order.id} buyurtmadagi {confirmation.info.confirmationCount} tayyor bo'lganini tasdiqlaysizmi?
            </h2>
            <div className="packing-confirm-actions">
              <button type="button" className="packing-cancel-button" disabled={Boolean(savingKey)} onClick={() => setConfirmation(null)}>Yo'q</button>
              <button type="button" className="packing-done-button" disabled={Boolean(savingKey)} onClick={confirmProduct}>Ha, tasdiqlayman</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
