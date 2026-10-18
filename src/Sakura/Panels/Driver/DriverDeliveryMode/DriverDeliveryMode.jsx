import { db } from "../../../../firebase";
import {
  deleteField,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  CommentIcon,
  LocationIcon,
  PhoneIcon,
  PriceIcon,
  TimeIcon,
  UserIcon,
} from "../../../MainIcons/SvgIcons";
import carpetIcon from "../../../MainIcons/carpetIcon.png";
import blanketIcon from "../../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../../MainIcons/yakandozIcon.png";
import curtainIcon from "../../../MainIcons/curtainIcon.png";
import "./DriverDeliveryMode.css";

const numberOrZero = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

function getTashkentDateId() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function DriverDeliveryMode({
  orders = [],
  driverTeam,
  loading = {},
  runAction,
  calculateTotalSalary,
  washerPrices,
  driverPrices,
  packingPrices,
  updateExpenseFund,
}) {
  const driverdeliverystatus = async (id, nextStatus) => {
    if (!driverTeam?.id) throw new Error("Haydovchi jamoasi topilmadi");

    const orderRef = doc(db, "orders", id);
    await runTransaction(db, async (transaction) => {
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) throw new Error("Buyurtma topilmadi");
      const order = orderSnap.data();

      if (nextStatus === "Yetkazilmoqda") {
        if (order.status !== "Tayyor") {
          throw new Error("Buyurtma boshqa haydovchi tomonidan olingan");
        }
        transaction.update(orderRef, {
          status: "Yetkazilmoqda",
          deliveryDriverTeamId: driverTeam.id,
          deliveryDriverTeamName: driverTeam.teamName,
        });
        return;
      }

      if (nextStatus === "Tayyor") {
        if (
          order.status !== "Yetkazilmoqda" ||
          order.deliveryDriverTeamId !== driverTeam.id
        ) {
          throw new Error("Bu buyurtma sizning jamoangizga biriktirilmagan");
        }
        transaction.update(orderRef, {
          status: "Tayyor",
          deliveryDriverTeamId: deleteField(),
          deliveryDriverTeamName: deleteField(),
        });
        return;
      }

      throw new Error("Yetkazish buyurtma holati noto'g'ri");
    });
  };

  const updateDriverDeliveryStatus = async (id) => {
    if (!driverTeam?.id) throw new Error("Haydovchi jamoasi topilmadi");

    const orderRef = doc(db, "orders", id);
    let completedOrder = null;
    const dateId = getTashkentDateId();
    const workerEarningsRef = doc(db, "workerEarnings", dateId);
    const teamEarningsRef = doc(db, "teamEarnings", dateId);

    await runTransaction(db, async (transaction) => {
      const [orderSnap, workerSnap, teamSnap] = await Promise.all([
        transaction.get(orderRef),
        transaction.get(workerEarningsRef),
        transaction.get(teamEarningsRef),
      ]);
      if (!orderSnap.exists()) throw new Error("Buyurtma topilmadi");

      const order = orderSnap.data();
      if (
        order.status !== "Yetkazilmoqda" ||
        order.deliveryDriverTeamId !== driverTeam.id
      ) {
        throw new Error("Buyurtma ushbu haydovchi jamoasiga biriktirilmagan");
      }

      const kvm = numberOrZero(order.kvm)
        || numberOrZero(order.kvmSt) + numberOrZero(order.kvmPro);
      const hasBlanketSizes = numberOrZero(order.blanket1x)
        + numberOrZero(order.blanket2x)
        + numberOrZero(order.matras) > 0;
      const blanket1x = hasBlanketSizes
        ? numberOrZero(order.blanket1x)
        : numberOrZero(order.blanketCount);
      const blanket2x = hasBlanketSizes ? numberOrZero(order.blanket2x) : 0;
      const matras = hasBlanketSizes ? numberOrZero(order.matras) : 0;
      const hasYakandozSizes = numberOrZero(order.yakandozM)
        + numberOrZero(order.yakandozS)
        + numberOrZero(order.yakandozL) > 0;
      const yakandozM = hasYakandozSizes
        ? numberOrZero(order.yakandozM)
        : numberOrZero(order.yakandozCount);
      const yakandozS = hasYakandozSizes ? numberOrZero(order.yakandozS) : 0;
      const yakandozL = hasYakandozSizes ? numberOrZero(order.yakandozL) : 0;
      const payroll = [
        { quantityField: "deliveryCarpetKvm", salaryField: "deliveryCarpetSalary", quantity: kvm, amount: 500 },
        { quantityField: "deliveryBlanket1xCount", salaryField: "deliveryBlanket1xSalary", quantity: blanket1x, amount: 1000 },
        { quantityField: "deliveryBlanket2xCount", salaryField: "deliveryBlanket2xSalary", quantity: blanket2x, amount: 1000 },
        { quantityField: "deliveryMatrasCount", salaryField: "deliveryMatrasSalary", quantity: matras, amount: 1500 },
        { quantityField: "deliveryYakandozMCount", salaryField: "deliveryYakandozMSalary", quantity: yakandozM, amount: 500 },
        { quantityField: "deliveryYakandozSCount", salaryField: "deliveryYakandozSSalary", quantity: yakandozS, amount: 1000 },
        { quantityField: "deliveryYakandozLCount", salaryField: "deliveryYakandozLSalary", quantity: yakandozL, amount: 1200 },
      ].filter((service) => service.quantity > 0);
      const totalSalary = payroll.reduce(
        (sum, service) => sum + service.quantity * service.amount,
        0
      );

      const activeMembers = Object.values(driverTeam.members || {}).filter(
        (member) => member.working
      );
      if (totalSalary > 0 && activeMembers.length > 0) {
        const leader = activeMembers.find((member) => member.rank === "leader");
        const nonLeaderCount = activeMembers.filter((member) => member.rank !== "leader").length;
        const memberShare = (member, amount) => {
          if (activeMembers.length === 1) return amount;
          if (leader && member.rank === "leader") return amount * 0.55;
          if (leader && member.rank !== "leader") return amount * 0.45 / nonLeaderCount;
          return amount / activeMembers.length;
        };
        const distributedSalary = totalSalary;
        const workerData = workerSnap.exists() ? workerSnap.data() : {};
        const memberEarnings = {};

        for (const member of activeMembers) {
          const earned = payroll.reduce((sum, service) => {
            const total = service.quantity * service.amount;
            return sum + memberShare(member, total);
          }, 0);
          const oldWorker = workerData[member.phone] || { name: member.name };
          memberEarnings[member.phone] = {
            ...oldWorker,
            name: member.name,
            driverSalary: numberOrZero(oldWorker.driverSalary) + earned,
          };
        }

        if (activeMembers.length) {
          transaction.set(workerEarningsRef, { ...workerData, ...memberEarnings });
        }

        const teamData = teamSnap.exists() ? teamSnap.data() : {};
        const oldTeam = teamData[driverTeam.id] || {};
        const nextTeam = {
          ...oldTeam,
          type: "driver",
          teamName: driverTeam.teamName,
          totalSalary: numberOrZero(oldTeam.totalSalary ?? oldTeam.salary) + distributedSalary,
          totalDeliverySalary: numberOrZero(oldTeam.totalDeliverySalary ?? oldTeam.deliverySalary) + distributedSalary,
          salary: numberOrZero(oldTeam.salary) + distributedSalary,
          deliverySalary: numberOrZero(oldTeam.deliverySalary) + distributedSalary,
        };

        for (const service of payroll) {
          const salary = service.quantity * service.amount;
          nextTeam[service.quantityField] = numberOrZero(oldTeam[service.quantityField]) + service.quantity;
          nextTeam[service.salaryField] = numberOrZero(oldTeam[service.salaryField]) + salary;
        }
        const deliverySummary = [
          ["deliveryBlanketCount", blanket1x + blanket2x + matras],
          ["deliveryBlanketSalary", blanket1x * 1000 + blanket2x * 1000 + matras * 1500],
          ["deliveryYakandozCount", yakandozM + yakandozS + yakandozL],
          ["deliveryYakandozSalary", yakandozM * 500 + yakandozS * 1000 + yakandozL * 1200],
        ];
        for (const [field, value] of deliverySummary) {
          if (value > 0) nextTeam[field] = numberOrZero(oldTeam[field]) + value;
        }

        transaction.set(teamEarningsRef, {
          ...teamData,
          [driverTeam.id]: nextTeam,
        });
      }

      completedOrder = { ...order, firebaseId: id };
      const archiveId = order.id || id;
      transaction.set(doc(db, "archives", archiveId), {
        ...order,
        status: "Yetkazildi",
        archivedAt: serverTimestamp(),
        archiveDate: dateId,
        totalSalary: typeof calculateTotalSalary === "function"
          ? calculateTotalSalary(order, washerPrices, driverPrices, packingPrices)
          : totalSalary,
      });
      transaction.delete(orderRef);
    });

    if (completedOrder && typeof updateExpenseFund === "function") {
      await updateExpenseFund(completedOrder);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("uz-UZ", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const readyOrders = orders.filter((order) => order.status === "Tayyor");
  const myOrders = orders.filter((order) =>
    order.status === "Yetkazilmoqda" &&
    order.deliveryDriverTeamId === driverTeam?.id
  );
  const hasProductCount = (value) =>
    value !== undefined && value !== null && value !== "";

  const OrderCard = ({ order, mine = false }) => {
    const id = order.firebaseId || order.id;
    const run = (key, action) => runAction
      ? runAction(key, action)
      : action();

    return (
      <article className={`driver-order-card ${order.tarif === "tezkor" ? "driver-order-card--quick" : ""}`}>
        <div className="driver-order-card__top">
          <span className="driver-order-card__id">{order.id}</span>
          <span className={`driver-order-card__status ${mine ? "is-progress" : "is-new"}`}>
            {order.status}
          </span>
        </div>

        <div className="driver-order-card__info">
          <div className="driver-order-info-row"><UserIcon /><span>{order.customerId || "Mijoz"}</span></div>
          {order.phone && <a className="driver-order-info-row" href={`tel:${order.phone}`}><PhoneIcon /><span>{order.phone}</span></a>}
          {(order.address || order.location) && (
            <div className="driver-order-info-row driver-delivery-address">
              <LocationIcon />
              <span>{order.address || "Manzil ko‘rsatilmagan"}</span>
              {order.location && (
                <a className="driver-delivery-map-button" href={order.location} target="_blank" rel="noreferrer">
                  Xarita
                </a>
              )}
            </div>
          )}
        </div>

        <div className="driver-delivery-products">
          <div className={`driver-delivery-product ${hasProductCount(order.carpetCount) ? "active" : "inactive"}`}>
            <img src={carpetIcon} alt="Gilam" />
            {hasProductCount(order.carpetCount) && <span>{order.carpetCount ?? 0} / {order.kvm ?? 0}</span>}
          </div>
          <div className={`driver-delivery-product ${hasProductCount(order.blanketCount) ? "active" : "inactive"}`}>
            <img src={blanketIcon} alt="Adyol" />
            {hasProductCount(order.blanketCount) && <span>{order.blanketCount}</span>}
          </div>
          <div className={`driver-delivery-product ${hasProductCount(order.yakandozCount) ? "active" : "inactive"}`}>
            <img src={yakandozIcon} alt="Yakandoz" />
            {hasProductCount(order.yakandozCount) && <span>{order.yakandozCount}</span>}
          </div>
          <div className={`driver-delivery-product ${hasProductCount(order.curtainCount) ? "active" : "inactive"}`}>
            <img src={curtainIcon} alt="Parda" />
            {hasProductCount(order.curtainCount) && <span>{order.curtainCount}</span>}
          </div>
        </div>

        {order.price !== undefined &&
          order.price !== null &&
          order.price !== "" && (
            <div className="driver-delivery-price">
              <PriceIcon className="driver-delivery-price__icon" />
              <span>{Number(order.price).toLocaleString("uz-UZ")} so'm</span>
            </div>
          )}

        {(order.comment || order.driverComment) && (
          <div className="driver-delivery-comment">
            <CommentIcon />
            <div>
              {order.comment && <p> {order.comment}</p>}
              {order.driverComment && <p> {order.driverComment}</p>}
            </div>
          </div>
        )}

        <div className="driver-order-card__bottom">
          <div className="driver-pickup-date"><TimeIcon /><span>{formatDate(order.createdAt)}</span></div>
          {mine ? (
            <div className="driver-order-actions">
              <button
                type="button"
                className="driver-pickup-primary-button"
                disabled={loading[`deliver-${id}`]}
                onClick={() => run(`deliver-${id}`, () => updateDriverDeliveryStatus(id))}
              >
                {loading[`deliver-${id}`] ? "Kuting..." : "Yetkazildi"}
              </button>
              <button
                type="button"
                className="driver-pickup-cancel-button"
                disabled={loading[`cancel-delivery-${id}`]}
                onClick={() => run(`cancel-delivery-${id}`, () => driverdeliverystatus(id, "Tayyor"))}
              >
                {loading[`cancel-delivery-${id}`] ? "Kuting..." : "Bekor qilish"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="driver-pickup-primary-button"
              disabled={loading[`take-delivery-${id}`]}
              onClick={() => run(`take-delivery-${id}`, () => driverdeliverystatus(id, "Yetkazilmoqda"))}
            >
              {loading[`take-delivery-${id}`] ? "Kuting..." : "Men yetkazaman"}
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="driver-delivery">
      <header className="driver-pickup-header">
        <h1>Yetkazish</h1>
        <p>Tayyor buyurtmalarni yetkazish</p>
      </header>
      <section className="driver-pickup-section">
        <h2>Mening buyurtmalarim</h2>
        <div className="driver-pickup-list">
          {myOrders.length ? myOrders.map((order) => <OrderCard key={order.firebaseId || order.id} order={order} mine />) : <div className="driver-pickup-empty">Sizda yetkazilayotgan buyurtmalar yo'q</div>}
        </div>
      </section>
      <section className="driver-pickup-section">
        <h2>Tayyor buyurtmalar</h2>
        <div className="driver-pickup-list">
          {readyOrders.length ? readyOrders.map((order) => <OrderCard key={order.firebaseId || order.id} order={order} />) : <div className="driver-pickup-empty">Hozircha tayyor buyurtmalar yo'q</div>}
        </div>
      </section>
    </div>
  );
}
