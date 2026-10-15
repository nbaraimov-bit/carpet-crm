import { useState } from "react";
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
  updateStatus,
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
          <button
            type="button"
            className="driver-pickup-primary-button"
            onClick={() => openModal(order)}
          >
            Ma’lumot kiritish
          </button>
        ) : (
          <button
            type="button"
            className="driver-pickup-primary-button"
            disabled={loading[`take-${order.firebaseId}`]}
            onClick={() =>
              runAction(
                `take-${order.firebaseId}`,
                async () => {
                  await updateStatus(
                    order.firebaseId,
                    "Olinmoqda"
                  );
                }
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
      />
    </div>
  );
}