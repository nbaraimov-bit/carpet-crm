import { useMemo, useState } from "react";
import carpetIcon from "../../MainIcons/carpetIcon.png";
import blanketIcon from "../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../MainIcons/yakandozIcon.png";
import { BackIcon, CommentIcon, LocationIcon, PhoneIcon, UserIcon } from "../../MainIcons/SvgIcons";
import { db } from "../../../firebase";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
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
  addWorkerEarnings,
  getTodayString,
  setRole,
}) {
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const teamId = washerTeam?.id;

  const updateWasherStatus = async (id, category) => {
    const orderRef = doc(db, "orders", id);
    const team = washerTeam;
    if (!team) throw new Error("Faol yuvuvchi jamoa topilmadi");

    const categoryConfig = {
      carpet: {
        statusField: "carpetStatus",
        teamIdField: "carpetWasherTeamId",
        teamNameField: "carpetWasherTeamName",
        dateField: "carpetDate",
        rates: [
          { key: "carpet", rateKey: "carpetSt", legacyRateKey: "carpet", earningKey: "carpet", quantity: "kvmSt" },
          { key: "carpet", rateKey: "carpetPro", legacyRateKey: "carpet", earningKey: "carpet", quantity: "kvmPro" },
        ],
      },
      blanket: {
        statusField: "blanketStatus",
        teamIdField: "blanketWasherTeamId",
        teamNameField: "blanketWasherTeamName",
        dateField: "blanketDate",
        rates: [
          { key: "blanket", rateKey: "blanket1x", legacyRateKey: "blanket", earningKey: "blanket1x", quantity: "blanket1x" },
          { key: "blanket", rateKey: "blanket2x", legacyRateKey: "blanket", earningKey: "blanket2x", quantity: "blanket2x" },
          { key: "blanket", rateKey: "matras", legacyRateKey: "blanket", earningKey: "matras", quantity: "matras" },
        ],
      },
      yakandoz: {
        statusField: "yakandozStatus",
        teamIdField: "yakandozWasherTeamId",
        teamNameField: "yakandozWasherTeamName",
        dateField: "yakandozDate",
        rates: [
          { key: "yakandoz", rateKey: "yakandozM", legacyRateKey: "yakandoz", earningKey: "yakandozM", quantity: "yakandozM" },
          { key: "yakandoz", rateKey: "yakandozS", legacyRateKey: "yakandoz", earningKey: "yakandozS", quantity: "yakandozS" },
          { key: "yakandoz", rateKey: "yakandozL", legacyRateKey: "yakandoz", earningKey: "yakandozL", quantity: "yakandozL" },
        ],
      },
    };
    const config = categoryConfig[category];
    if (!config) throw new Error("Mahsulot turi noto'g'ri");

    const order = await runTransaction(db, async (transaction) => {
      const orderSnapshot = await transaction.get(orderRef);
      if (!orderSnapshot.exists()) throw new Error("Buyurtma topilmadi");
      const latestOrder = orderSnapshot.data();
      if (latestOrder[config.statusField] === "Yuvildi") return null;

      const assignedTeamId = latestOrder[config.teamIdField];
      if (assignedTeamId && assignedTeamId !== team.id) {
        throw new Error("Bu mahsulot boshqa jamoaga biriktirilgan");
      }

      const orderUpdates = {
        [config.statusField]: "Yuvildi",
        [config.teamIdField]: team.id,
        [config.teamNameField]: team.teamName,
        [config.dateField]: serverTimestamp(),
      };
      const categoryFields = [
        { status: "carpetStatus", count: Number(latestOrder.kvmSt || 0) + Number(latestOrder.kvmPro || 0) || Number(latestOrder.kvm || 0) || Number(latestOrder.carpetCount || 0) },
        { status: "blanketStatus", count: Number(latestOrder.blanket1x || 0) + Number(latestOrder.blanket2x || 0) + Number(latestOrder.matras || 0) || Number(latestOrder.blanketCount || 0) },
        { status: "yakandozStatus", count: Number(latestOrder.yakandozM || 0) + Number(latestOrder.yakandozS || 0) + Number(latestOrder.yakandozL || 0) || Number(latestOrder.yakandozCount || 0) },
      ].filter((item) => item.count > 0);
      const allProductsDone = categoryFields.every((item) =>
        item.status === config.statusField || latestOrder[item.status] === "Yuvildi"
      );
      if (allProductsDone) orderUpdates.status = "Yuvildi";
      transaction.update(orderRef, orderUpdates);
      return latestOrder;
    });
    if (!order) return;

    const hasSizeFields = config.rates.some((rate) => Number(order[rate.quantity] || 0) > 0);
    const legacyQuantity = category === "carpet"
      ? Number(order.kvm || 0)
      : Number(order[category === "blanket" ? "blanketCount" : "yakandozCount"] || 0);
    const wageServices = config.rates
      .map((rate) => ({
        key: rate.key,
        rateKey: hasSizeFields ? rate.rateKey : rate.legacyRateKey,
        earningKey: rate.earningKey,
        quantity: hasSizeFields ? Number(order[rate.quantity] || 0) : 0,
      }))
      .filter((service) => service.quantity > 0);

    if (!hasSizeFields && legacyQuantity > 0) {
      wageServices.push({
        key: category,
        rateKey: config.rates[0].legacyRateKey,
        earningKey: config.rates[0].earningKey,
        quantity: legacyQuantity,
      });
    }

    const activeMembers = Object.entries(team.members || {})
      .filter(([, member]) => member.working)
      .map(([phone, member]) => ({ ...member, phone: member.phone || phone }));
    for (const service of wageServices) {
      await addWorkerEarnings({
        dateId: getTodayString(),
        members: activeMembers,
        service,
        teamId: team.id,
        teamName: team.teamName,
        teamType: "washer",
      });
    }
  };

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
