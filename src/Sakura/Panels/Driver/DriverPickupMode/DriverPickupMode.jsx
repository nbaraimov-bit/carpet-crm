import { useState } from "react";
import { db } from "../../../../firebase";
import { deleteField, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import "./DriverPickupMode.css";
import DriverPickupModal from "./DriverPickupModal";

import {
  UserIcon,
  PhoneIcon,
  LocationIcon,
  CommentIcon,
  PriceIcon,
  TimeIcon,
} from "../../../MainIcons/SvgIcons";

export default function DriverPickupMode({
  orders = [],
  driverTeam,
  loading = {},
  runAction,
}) {
  const [editingOrder, setEditingOrder] = useState(null);

  const [form, setForm] = useState({
    carpetCount: "",
    kvmst: "",
    kvmpro: "",
    blanketCount: "",
    blanketCount2: "",
    mattressCount: "",
    yakandozM: "",
    yakandozS: "",
    yakandozL: "",
    driverComment: "",
    price: "",
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openModal = (order) => {
    setEditingOrder(order);

    setForm({
      carpetCount: order.carpetCount ?? "",
      kvmst: order.kvmst ?? "",
      kvmpro: order.kvmpro ?? "",
      blanketCount: order.blanketCount ?? "",
      blanketCount2: order.blanketCount2 ?? "",
      mattressCount: order.mattressCount ?? "",
      yakandozM: order.yakandozM ?? "",
      yakandozS: order.yakandozS ?? "",
      yakandozL: order.yakandozL ?? "",
      driverComment: order.driverComment ?? "",
      price: order.price ?? "",
    });
  };

  const closeModal = () => {
    setEditingOrder(null);
  };

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const driverPickupStatus = async (id, nextStatus) => {
    if (!driverTeam?.id) {
      throw new Error("Haydovchi jamoasi topilmadi");
    }

    const orderRef = doc(db, "orders", id);

    await runTransaction(db, async (transaction) => {
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) throw new Error("Buyurtma topilmadi");

      const order = orderSnap.data();

      if (nextStatus === "Olinmoqda") {
        if (order.status !== "Yangi") {
          throw new Error("Buyurtma boshqa haydovchi tomonidan olingan");
        }

        transaction.update(orderRef, {
          status: "Olinmoqda",
          pickupDriverTeamId: driverTeam.id,
          pickupDriverTeamName: driverTeam.teamName,
        });
        return;
      }

      if (nextStatus === "Yangi") {
        if (
          order.status !== "Olinmoqda" ||
          order.pickupDriverTeamId !== driverTeam.id
        ) {
          throw new Error("Bu buyurtma sizning jamoangizga biriktirilmagan");
        }

        transaction.update(orderRef, {
          status: "Yangi",
          pickupDriverTeamId: deleteField(),
          pickupDriverTeamName: deleteField(),
        });
        return;
      }

      throw new Error("Haydovchi buyurtma holati noto‘g‘ri");
    });
  };

  const updateDriverStatus = async (id, form, locationUrl) => {
    if (!driverTeam?.id) {
      throw new Error("Haydovchi jamoasi topilmadi");
    }

    const orderRef = doc(db, "orders", id);
    const now = new Date();
    const dateId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const workerEarningsRef = doc(db, "workerEarnings", dateId);
    const teamEarningsRef = doc(db, "teamEarnings", dateId);

    const hasValue = (value) =>
      value !== undefined && value !== null && String(value).trim() !== "";
    const numericValue = (value) => {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    };
    const readQuantity = (key) =>
      hasValue(form[key]) ? numericValue(form[key]) : 0;

    const carpetCount = readQuantity("carpetCount");
    const kvmSt = readQuantity("kvmst");
    const kvmPro = readQuantity("kvmpro");
    const blanket1x = readQuantity("blanketCount");
    const blanket2x = readQuantity("blanketCount2");
    const mattress = readQuantity("mattressCount");
    const yakandozM = readQuantity("yakandozM");
    const yakandozS = readQuantity("yakandozS");
    const yakandozL = readQuantity("yakandozL");
    const hasKvm = hasValue(form.kvmst) || hasValue(form.kvmpro);
    const hasBlanket =
      hasValue(form.blanketCount) ||
      hasValue(form.blanketCount2) ||
      hasValue(form.mattressCount);
    const hasYakandoz =
      hasValue(form.yakandozM) ||
      hasValue(form.yakandozS) ||
      hasValue(form.yakandozL);
    const kvm = kvmSt + kvmPro;
    const blanketCount = blanket1x + blanket2x + mattress;
    const yakandozCount = yakandozM + yakandozS + yakandozL;

    const orderUpdates = {
      status: "Olindi",
      pickupDate: serverTimestamp(),
    };

    if (hasValue(form.carpetCount)) {
      orderUpdates.carpetCount = carpetCount;
    }
    if (hasValue(form.kvmst)) orderUpdates.kvmSt = kvmSt;
    if (hasValue(form.kvmpro)) orderUpdates.kvmPro = kvmPro;
    if (hasKvm) orderUpdates.kvm = kvm;
    if (hasValue(form.blanketCount)) orderUpdates.blanket1x = blanket1x;
    if (hasValue(form.blanketCount2)) orderUpdates.blanket2x = blanket2x;
    if (hasValue(form.mattressCount)) orderUpdates.matras = mattress;
    if (hasBlanket) orderUpdates.blanketCount = blanketCount;
    if (hasValue(form.yakandozM)) orderUpdates.yakandozM = yakandozM;
    if (hasValue(form.yakandozS)) orderUpdates.yakandozS = yakandozS;
    if (hasValue(form.yakandozL)) orderUpdates.yakandozL = yakandozL;
    if (hasYakandoz) orderUpdates.yakandozCount = yakandozCount;
    if (hasValue(form.driverComment)) {
      orderUpdates.driverComment = String(form.driverComment).trim();
    }
    if (hasValue(form.price)) orderUpdates.price = numericValue(form.price);
    if (locationUrl) orderUpdates.location = locationUrl;

    if (carpetCount > 0 || kvm > 0) orderUpdates.carpetStatus = "Olindi";
    if (blanketCount > 0) orderUpdates.blanketStatus = "Olindi";
    if (yakandozCount > 0) orderUpdates.yakandozStatus = "Olindi";

    const payroll = [
      { key: "carpet", quantity: kvm, amount: 700 },
      { key: "blanket", quantity: blanket1x, amount: 1200 },
      { key: "blanket", quantity: blanket2x, amount: 1500 },
      { key: "blanket", quantity: mattress, amount: 2000 },
      { key: "yakandoz", quantity: yakandozM, amount: 750 },
      { key: "yakandoz", quantity: yakandozS, amount: 1500 },
      { key: "yakandoz", quantity: yakandozL, amount: 1800 },
    ].filter((service) => service.quantity > 0);

    await runTransaction(db, async (transaction) => {
      const [orderSnap, workerEarningsSnap, teamEarningsSnap] = await Promise.all([
        transaction.get(orderRef),
        transaction.get(workerEarningsRef),
        transaction.get(teamEarningsRef),
      ]);

      if (!orderSnap.exists()) throw new Error("Buyurtma topilmadi");

      const order = orderSnap.data();
      if (order.status === "Olindi") return;
      if (
        order.status !== "Olinmoqda" ||
        order.pickupDriverTeamId !== driverTeam.id
      ) {
        throw new Error("Buyurtma ushbu haydovchi jamoasiga biriktirilmagan");
      }

      const activeMembers = Object.values(driverTeam.members || {}).filter(
        (member) => member.working
      );
      const totalSalary = payroll.reduce(
        (sum, service) => sum + service.quantity * service.amount,
        0
      );
      const payrollShareTotal = activeMembers.length === 1
        ? 1
        : activeMembers.reduce(
          (sum, member) => sum + (member.rank === "leader" ? 0.55 : 0.45),
          0
        );
      const distributedSalary = totalSalary * payrollShareTotal;

      if (totalSalary > 0 && activeMembers.length > 0) {
        const workerData = workerEarningsSnap.exists()
          ? workerEarningsSnap.data()
          : {};

        const memberEarnings = {};
        for (const member of activeMembers) {
          const earned = payroll.reduce((sum, service) => {
            const total = service.quantity * service.amount;
            const share = activeMembers.length === 1
              ? total
              : member.rank === "leader"
                ? total * 0.55
                : total * 0.45;
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
            driverSalary: Number(oldWorker.driverSalary || 0) + earned,
          };
        }

        transaction.set(workerEarningsRef, {
          ...workerData,
          ...memberEarnings,
        });

        const teamData = teamEarningsSnap.exists()
          ? teamEarningsSnap.data()
          : {};
        const oldTeam = teamData[driverTeam.id] || {
          type: "driver",
          teamName: driverTeam.teamName,
          pickupSalary: 0,
          deliverySalary: 0,
          salary: 0,
          pickupCarpetKvm: 0,
          pickupBlanketCount: 0,
          pickupYakandozCount: 0,
          pickupCurtainMeter: 0,
          pickupCarpetSalary: 0,
          pickupBlanketSalary: 0,
          pickupYakandozSalary: 0,
          pickupCurtainSalary: 0,
          deliveryCarpetKvm: 0,
          deliveryBlanketCount: 0,
          deliveryYakandozCount: 0,
          deliveryCurtainMeter: 0,
          deliveryCarpetSalary: 0,
          deliveryBlanketSalary: 0,
          deliveryYakandozSalary: 0,
          deliveryCurtainSalary: 0,
        };

        const categoryTotals = payroll.reduce((totals, service) => {
          const salary = service.quantity * service.amount;
          totals[service.key].quantity += service.quantity;
          totals[service.key].salary += salary * payrollShareTotal;
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
          salary: Number(oldTeam.salary || 0) + distributedSalary,
          pickupSalary: Number(oldTeam.pickupSalary || 0) + distributedSalary,
        };

        for (const [key, values] of Object.entries(categoryTotals)) {
          if (values.quantity <= 0) continue;
          const countField = key === "carpet"
            ? "pickupCarpetKvm"
            : key === "blanket"
              ? "pickupBlanketCount"
              : "pickupYakandozCount";
          const salaryField = `pickup${key[0].toUpperCase()}${key.slice(1)}Salary`;
          nextTeam[countField] = Number(oldTeam[countField] || 0) + values.quantity;
          nextTeam[salaryField] = Number(oldTeam[salaryField] || 0) + values.salary;
        }

        transaction.set(teamEarningsRef, {
          ...teamData,
          [driverTeam.id]: nextTeam,
        });
      }

      transaction.update(orderRef, orderUpdates);
    });
  };


  const savePickupDetails = (locationUrl) => {
    if (!editingOrder) return;

    const actionId = `pickup-save-${editingOrder.firebaseId}`;
    runAction(actionId, async () => {
      await updateDriverStatus(editingOrder.firebaseId, form, locationUrl);
      closeModal();
    });
  };

  const newOrders = orders.filter(
    (order) => order.status === "Yangi"
  );

  const myOrders = orders.filter(
    (order) =>
      order.status === "Olinmoqda" &&
      order.pickupDriverTeamId === driverTeam?.id
  );

  const OrderCard = ({ order, mine = false }) => (
    <article
      className={`driver-order-card ${
        order.tarif === "tezkor" ? "driver-order-card--quick" : ""
      }`}
      key={order.firebaseId || order.id}
    >
      <div className="driver-order-card__top">
        <span className="driver-order-card__id">
          #{order.id}
        </span>

        <span
          className={`driver-order-card__status ${
            mine ? "is-progress" : "is-new"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="driver-order-card__info">
        <div className="driver-order-info-row">
          <UserIcon />
          <span>{order.customerId || "Mijoz"}</span>
        </div>

        {order.phone && (
          <a
            className="driver-order-info-row"
            href={`tel:${order.phone}`}
          >
            <PhoneIcon />
            <span>{order.phone}</span>
          </a>
        )}

        {order.address && (
          <div className="driver-order-info-row">
            <LocationIcon />
            <span>{order.address}</span>
          </div>
        )}

        {order.comment && (
          <div className="driver-order-info-row">
            <CommentIcon />
            <span>{order.comment}</span>
          </div>
        )}
      </div>

      <div className="driver-order-card__bottom">
        <div className="driver-pickup-date">
          <TimeIcon />
          <span>{formatDate(order.createdAt)}</span>
        </div>

        {mine ? (
          <div className="driver-order-actions">
            <button
              type="button"
              className="driver-pickup-primary-button"
              onClick={() => openModal(order)}
            >
              Ma’lumot kiritish
            </button>
            <button
              type="button"
              className="driver-pickup-cancel-button"
              disabled={loading[`cancel-pickup-${order.firebaseId}`]}
              onClick={() =>
                runAction(
                  `cancel-pickup-${order.firebaseId}`,
                  async () => driverPickupStatus(order.firebaseId, "Yangi")
                )
              }
            >
              {loading[`cancel-pickup-${order.firebaseId}`]
                ? "Kuting..."
                : "Bekor qilish"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="driver-pickup-primary-button"
            disabled={loading[`take-${order.firebaseId}`]}
            onClick={() =>
              runAction(
                `take-${order.firebaseId}`,
                async () => driverPickupStatus(order.firebaseId, "Olinmoqda")
              )
            }
          >
            {loading[`take-${order.firebaseId}`]
              ? "Kuting..."
              : "Men olaman"}
          </button>
        )}
      </div>
    </article>
  );

  return (
    <div className="driver-pickup">
      <header className="driver-pickup-header">
        <div>
          <h1>Olish</h1>
          <p>Buyurtmalarni qabul qilish</p>
        </div>
      </header>

      <section className="driver-pickup-section">
        <h2>Yangi buyurtmalar</h2>

        <div className="driver-pickup-list">
          {newOrders.length ? (
            newOrders.map((order) => (
              <OrderCard
                key={order.firebaseId || order.id}
                order={order}
              />
            ))
          ) : (
            <div className="driver-pickup-empty">
              Hozircha yangi buyurtmalar yo‘q
            </div>
          )}
        </div>
      </section>

      <section className="driver-pickup-section">
        <h2>Mening buyurtmalarim</h2>

        <div className="driver-pickup-list">
          {myOrders.length ? (
            myOrders.map((order) => (
              <OrderCard
                key={order.firebaseId || order.id}
                order={order}
                mine
              />
            ))
          ) : (
            <div className="driver-pickup-empty">
              Sizda olinayotgan buyurtmalar yo‘q
            </div>
          )}
        </div>
      </section>

      <DriverPickupModal
        order={editingOrder}
        form={form}
        onClose={closeModal}
        onFieldChange={updateField}
        onSave={savePickupDetails}
        saving={loading[`pickup-save-${editingOrder?.firebaseId}`]}
      />
    </div>
  );
}
