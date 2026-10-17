import { useMemo, useState } from "react";
import carpetIcon from "../../MainIcons/carpetIcon.png";
import blanketIcon from "../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../MainIcons/yakandozIcon.png";
import { BackIcon, CommentIcon, LocationIcon, PhoneIcon, UserIcon } from "../../MainIcons/SvgIcons";
import "./WasherPanel.css";

const products = [
  { key: "carpet", title: "Gilam", statusField: "carpetStatus", teamField: "carpetWasherTeamId", icon: carpetIcon },
  { key: "blanket", title: "Adyol", statusField: "blanketStatus", teamField: "blanketWasherTeamId", icon: blanketIcon },
  { key: "yakandoz", title: "Yakandoz", statusField: "yakandozStatus", teamField: "yakandozWasherTeamId", icon: yakandozIcon },
];

const number = (value) => Number(value || 0);
const formatMoney = (value) => `${Math.round(number(value)).toLocaleString("uz-UZ")} so'm`;

function getProductInfo(order, key, washerTeam) {
  const activeMembers = Object.values(washerTeam?.members || {}).filter((member) => member.working);
  const rateTotal = (field, legacyField) => activeMembers.reduce(
    (sum, member) => sum + number(member[field] ?? member[legacyField]),
    0
  );

  if (key === "carpet") {
    const hasSizes = number(order.kvmSt) + number(order.kvmPro) > 0;
    const st = hasSizes ? number(order.kvmSt) : number(order.kvm);
    const pro = hasSizes ? number(order.kvmPro) : 0;
    const count = number(order.carpetCount);
    const salary = st * rateTotal(hasSizes ? "carpetSt" : "carpet", "carpet")
      + pro * rateTotal("carpetPro", "carpet");
    return {
      count: count ? `${count} / ${st + pro}` : `${st + pro}`,
      confirmationCount: count ? `${count} ta` : `${st + pro}`,
      salary,
    };
  }

  if (key === "blanket") {
    const hasSizes = number(order.blanket1x) + number(order.blanket2x) + number(order.matras) > 0;
    const oneX = hasSizes ? number(order.blanket1x) : number(order.blanketCount);
    const twoX = hasSizes ? number(order.blanket2x) : 0;
    const matras = hasSizes ? number(order.matras) : 0;
    const salary = oneX * rateTotal(hasSizes ? "blanket1x" : "blanket", "blanket")
      + twoX * rateTotal("blanket2x", "blanket")
      + matras * rateTotal("matras", "blanket");
    return { count: `${oneX + twoX + matras}`, confirmationCount: `${oneX + twoX + matras} ta`, salary };
  }

  const hasSizes = number(order.yakandozM) + number(order.yakandozS) + number(order.yakandozL) > 0;
  const sizeM = hasSizes ? number(order.yakandozM) : number(order.yakandozCount);
  const sizeS = hasSizes ? number(order.yakandozS) : 0;
  const sizeL = hasSizes ? number(order.yakandozL) : 0;
  const salary = sizeM * rateTotal(hasSizes ? "yakandozM" : "yakandoz", "yakandoz")
    + sizeS * rateTotal("yakandozS", "yakandoz")
    + sizeL * rateTotal("yakandozL", "yakandoz");
  return { count: `${sizeM + sizeS + sizeL}`, confirmationCount: `${sizeM + sizeS + sizeL} ta`, salary };
}

function hasProduct(order, key) {
  if (key === "carpet") return number(order.carpetCount) > 0 || number(order.kvmSt) + number(order.kvmPro) + number(order.kvm) > 0;
  if (key === "blanket") return number(order.blanket1x) + number(order.blanket2x) + number(order.matras) + number(order.blanketCount) > 0;
  return number(order.yakandozM) + number(order.yakandozS) + number(order.yakandozL) + number(order.yakandozCount) > 0;
}

export default function WasherPanel({
  orders = [],
  washerTeam,
  updateWasherStatus,
  setRole,
}) {
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const teamId = washerTeam?.id;

  const visibleOrders = useMemo(() => orders
    .filter((order) => order.status !== "Yuvildi")
    .map((order) => ({
      ...order,
      availableProducts: products.filter((product) => {
        const status = order[product.statusField];
        const assignedTeam = order[product.teamField];
        const canSeeStage = ["Olindi", "Kutmoqda", "Yuvilmoqda"].includes(status)
          || (!status && order.status === "Olindi");
        return hasProduct(order, product.key)
          && status !== "Yuvildi"
          && canSeeStage
          && (!assignedTeam || assignedTeam === teamId);
      }),
    }))
    .filter((order) => order.availableProducts.length > 0)
    .sort((first, second) => {
      const firstIsQuick = first.tarif === "tezkor";
      const secondIsQuick = second.tarif === "tezkor";
      if (firstIsQuick !== secondIsQuick) return firstIsQuick ? -1 : 1;
      return String(first.id ?? "").localeCompare(String(second.id ?? ""), undefined, { numeric: true });
    }), [orders, teamId]);

  const confirmProduct = async () => {
    if (!confirmation || !teamId) return;
    const { order, product } = confirmation;
    const actionKey = `washer-${product.key}-${order.firebaseId}`;
    setNotice("");
    setSavingKey(actionKey);
    try {
      await updateWasherStatus(order.firebaseId, product.key);
      setConfirmation(null);
    } catch (error) {
      setNotice(error.message || "Mahsulot holatini saqlab bo'lmadi");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <main className="washer-page">
      <button
        type="button"
        className="washer-back-button"
        onClick={() => setRole?.("")}
        aria-label="Bosh menyuga qaytish"
      >
        <BackIcon className="washer-back-icon" />
      </button>
      <header className="washer-page-header">
        <div>
          <span className="washer-eyebrow">WASHER PANEL</span>
          <h1>Yuvish buyurtmalari</h1>
          <p>{washerTeam?.teamName || "Faol yuvuvchi jamoa tanlanmagan"}</p>
        </div>
      </header>

      {notice && <div className="washer-notice" role="alert">{notice}</div>}

      {!washerTeam && (
        <div className="washer-empty">Buyurtmalarni bajarish uchun faol yuvuvchi jamoaga a'zo bo'ling.</div>
      )}

      {washerTeam && visibleOrders.length === 0 && (
        <div className="washer-empty">Hozircha yuvilishi kerak bo'lgan buyurtma yo'q.</div>
      )}

      <section className="washer-orders">
        {visibleOrders.map((order) => (
          <article className={`washer-order-card ${order.tarif === "tezkor" ? "quick" : ""}`} key={order.firebaseId || order.id}>
            <header className="washer-order-header">
              <div className="washer-order-id">{order.id}</div>
              <span className={`washer-order-status ${order.tarif === "tezkor" ? "quick" : ""}`}>
                {order.tarif === "tezkor" ? "Tezkor" : order.status || "Olindi"}
              </span>
            </header>

            <div className="washer-order-details">
              <div className="washer-info-row"><UserIcon /><span>{order.customerId || "Mijoz"}</span></div>
              {order.phone && <a className="washer-info-row" href={`tel:${order.phone}`}><PhoneIcon /><span>{order.phone}</span></a>}
              {order.address && <div className="washer-info-row"><LocationIcon /><span>{order.address}</span></div>}
            </div>

            {(order.comment || order.driverComment) && (
              <div className="washer-comment">
                <CommentIcon />
                <div>
                  {order.comment && <p>{order.comment}</p>}
                  {order.driverComment && <p>{order.driverComment}</p>}
                </div>
              </div>
            )}

            <div className="washer-products">
              {products.map((product) => {
                const info = getProductInfo(order, product.key, washerTeam);
                const actionKey = `washer-${product.key}-${order.firebaseId}`;
                const busy = savingKey === actionKey;
                const present = hasProduct(order, product.key);
                const completed = order[product.statusField] === "Yuvildi";
                const available = order.availableProducts.some((item) => item.key === product.key);
                return (
                  <div className={`washer-product ${present ? "active" : "inactive"} ${completed ? "completed" : ""}`} key={product.key}>
                    <div className="washer-product-quantity">
                      <img src={product.icon} alt={product.title} />
                      {present && <span>{info.count}</span>}
                      <i className={completed ? "is-done" : ""} />
                    </div>
                    <button
                      type="button"
                      className="washer-done-button"
                      disabled={busy || !teamId || !present || !available || completed}
                      onClick={() => setConfirmation({ order, product, info })}
                    >
                      {busy ? "Kuting..." : "Yuvildi"}
                    </button>
                    {present && <small className="washer-product-salary">{formatMoney(info.salary)}</small>}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      {confirmation && (
        <div className="washer-confirm-overlay" onClick={() => setConfirmation(null)}>
          <section
            className="washer-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="washer-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="washer-eyebrow">TASDIQLASH</span>
            <h2 id="washer-confirm-title">
              {confirmation.order.id} buyurtmani {confirmation.info.confirmationCount} {confirmation.product.title.toLowerCase()}ini yuvganingizni tasdiqlaysizmi?
            </h2>
            <div className="washer-confirm-actions">
                <button type="button" className="washer-cancel-button" disabled={Boolean(savingKey)} onClick={() => setConfirmation(null)}>Yo'q</button>
              <button
                type="button"
                className="washer-done-button"
                disabled={Boolean(savingKey)}
                onClick={confirmProduct}
              >
                Ha, tasdiqlayman
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
