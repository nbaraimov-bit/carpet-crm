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
  TimeIcon,
  UserIcon,
} from "../../../MainIcons/SvgIcons";
import carpetIcon from "../../../MainIcons/carpetIcon.png";
import blanketIcon from "../../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../../MainIcons/yakandozIcon.png";
import "./DriverDeliveryMode.css";

const numberOrZero = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

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
    const now = new Date();
    const dateId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
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

      const payroll = [
        { key: "carpet", quantity: numberOrZero(order.kvm), amount: 500 },
        { key: "blanket", quantity: numberOrZero(order.blanketCount), amount: 1000 },
        { key: "yakandozM", quantity: numberOrZero(order.yakandozM), amount: 500 },
        { key: "yakandozS", quantity: numberOrZero(order.yakandozS), amount: 1000 },
        { key: "yakandozL", quantity: numberOrZero(order.yakandozL), amount: 1200 },
      ].filter((service) => service.quantity > 0);
      const totalSalary = payroll.reduce(
        (sum, service) => sum + service.quantity * service.amount,
        0
      );

      if (totalSalary > 0) {
        const activeMembers = Object.values(driverTeam.members || {}).filter(
          (member) => member.working
        );
        const payrollShareTotal = activeMembers.length === 1
          ? 1
          : activeMembers.reduce(
            (sum, member) => sum + (member.rank === "leader" ? 0.55 : 0.45),
            0
          );
        const distributedSalary = totalSalary * payrollShareTotal;
        const workerData = workerSnap.exists() ? workerSnap.data() : {};
        const memberEarnings = {};

        for (const member of activeMembers) {
          const earned = payroll.reduce((sum, service) => {
            const total = service.quantity * service.amount;
            const share = activeMembers.length === 1
              ? total
              : member.rank === "leader" ? total * 0.55 : total * 0.45;
            return sum + share;
          }, 0);
          const oldWorker = workerData[member.phone] || {
            name: member.name,
            washerSalary: 0,
            driverSalary: 0,
            packingSalary: 0,
          };
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
        const categoryTotals = payroll.reduce((totals, service) => {
          const category = service.key === "carpet"
            ? "carpet"
            : service.key === "blanket" ? "blanket" : "yakandoz";
          totals[category].quantity += service.quantity;
          totals[category].salary += service.quantity * service.amount * payrollShareTotal;
          return totals;
        }, {
          carpet: { quantity: 0, salary: 0 },
          blanket: { quantity: 0, salary: 0 },
          yakandoz: { quantity: 0, salary: 0 },
        });
        const nextTeam = {
          ...oldTeam,
          type: "driver",
          teamName: driverTeam.teamName,
          salary: numberOrZero(oldTeam.salary) + distributedSalary,
          deliverySalary: numberOrZero(oldTeam.deliverySalary) + distributedSalary,
        };

        for (const [category, values] of Object.entries(categoryTotals)) {
          if (!values.quantity) continue;
          const capitalized = category[0].toUpperCase() + category.slice(1);
          const quantityField = `delivery${capitalized}${category === "carpet" ? "Kvm" : "Count"}`;
          const salaryField = `delivery${capitalized}Salary`;
          nextTeam[quantityField] = numberOrZero(oldTeam[quantityField]) + values.quantity;
          nextTeam[salaryField] = numberOrZero(oldTeam[salaryField]) + values.salary;
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

  const OrderCard = ({ order, mine = false }) => {
    const id = order.firebaseId || order.id;
    const run = (key, action) => runAction
      ? runAction(key, action)
      : action();

    return (
      <article className={`driver-order-card ${order.tarif === "tezkor" ? "driver-order-card--quick" : ""}`}>
        <div className="driver-order-card__top">
          <span className="driver-order-card__id">#{order.id}</span>
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
          {order.comment && <div className="driver-order-info-row"><CommentIcon /><span>{order.comment}</span></div>}
        </div>

        <div className="driver-delivery-products">
          {numberOrZero(order.carpetCount) > 0 && (
            <div><img src={carpetIcon} alt="Gilam" /><span>{order.carpetCount} ta</span>{numberOrZero(order.kvm) > 0 && <small>{order.kvm} m2</small>}</div>
          )}
          {numberOrZero(order.blanketCount) > 0 && (
            <div><img src={blanketIcon} alt="Adyol" /><span>{order.blanketCount} ta</span></div>
          )}
          {numberOrZero(order.yakandozCount) > 0 && (
            <div><img src={yakandozIcon} alt="Yakandoz" /><span>{order.yakandozCount} ta</span></div>
          )}
        </div>

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
        <h2>Tayyor buyurtmalar</h2>
        <div className="driver-pickup-list">
          {readyOrders.length ? readyOrders.map((order) => <OrderCard key={order.firebaseId || order.id} order={order} />) : <div className="driver-pickup-empty">Hozircha tayyor buyurtmalar yo'q</div>}
        </div>
      </section>
      <section className="driver-pickup-section">
        <h2>Mening buyurtmalarim</h2>
        <div className="driver-pickup-list">
          {myOrders.length ? myOrders.map((order) => <OrderCard key={order.firebaseId || order.id} order={order} mine />) : <div className="driver-pickup-empty">Sizda yetkazilayotgan buyurtmalar yo'q</div>}
        </div>
      </section>
    </div>
  );
}
