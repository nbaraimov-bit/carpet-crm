import { useState } from "react";
import "./DriverPickupMode.css";

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
      className={`driver-pickup-card ${
        order.tarif === "tezkor" ? "driver-pickup-card--urgent" : ""
      }`}
      key={order.firebaseId || order.id}
    >
      <div className="driver-pickup-card__top">
        <span className="driver-pickup-card__id">
          #{order.id}
        </span>

        <span
          className={`driver-pickup-card__status ${
            mine ? "is-progress" : "is-new"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="driver-pickup-card__info">
        <div className="driver-pickup-info-row">
          <UserIcon />
          <span>{order.customerId || "Mijoz"}</span>
        </div>

        {order.phone && (
          <a
            className="driver-pickup-info-row"
            href={`tel:${order.phone}`}
          >
            <PhoneIcon />
            <span>{order.phone}</span>
          </a>
        )}

        {order.address && (
          <div className="driver-pickup-info-row">
            <LocationIcon />
            <span>{order.address}</span>
          </div>
        )}

        {order.comment && (
          <div className="driver-pickup-info-row">
            <CommentIcon />
            <span>{order.comment}</span>
          </div>
        )}
      </div>

      <div className="driver-pickup-card__footer">
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

      {editingOrder && (
        <div
          className="driver-pickup-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="driver-pickup-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="driver-pickup-modal__header">
              <div>
                <h2>Ma’lumot kiritish</h2>
                <p>Buyurtma #{editingOrder.id}</p>
              </div>

              <button
                type="button"
                className="driver-pickup-modal__close"
                onClick={closeModal}
                aria-label="Yopish"
              >
                ×
              </button>
            </div>

            <div className="driver-pickup-form">
              <label>
                Gilam soni
                <input
                  type="number"
                  min="0"
                  value={form.carpetCount}
                  onChange={(e) =>
                    updateField("carpetCount", e.target.value)
                  }
                  placeholder="Gilam soni"
                />
              </label>

              <div className="driver-pickup-form__two">
                <label>
                  KVM (ST)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.kvmst}
                    onChange={(e) =>
                      updateField("kvmst", e.target.value)
                    }
                    placeholder="ST kv.m"
                  />
                </label>

                <label>
                  KVM (PRO)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.kvmpro}
                    onChange={(e) =>
                      updateField("kvmpro", e.target.value)
                    }
                    placeholder="PRO kv.m"
                  />
                </label>
              </div>

              <label>
                Adyol soni
                <input
                  type="number"
                  min="0"
                  value={form.blanketCount}
                  onChange={(e) =>
                    updateField("blanketCount", e.target.value)
                  }
                  placeholder="Adyol"
                />
              </label>

              <div className="driver-pickup-form__three">
                <label>
                  Yakandoz M
                  <input
                    type="number"
                    min="0"
                    value={form.yakandozM}
                    onChange={(e) =>
                      updateField("yakandozM", e.target.value)
                    }
                    placeholder="M"
                  />
                </label>

                <label>
                  Yakandoz S
                  <input
                    type="number"
                    min="0"
                    value={form.yakandozS}
                    onChange={(e) =>
                      updateField("yakandozS", e.target.value)
                    }
                    placeholder="S"
                  />
                </label>

                <label>
                  Yakandoz L
                  <input
                    type="number"
                    min="0"
                    value={form.yakandozL}
                    onChange={(e) =>
                      updateField("yakandozL", e.target.value)
                    }
                    placeholder="L"
                  />
                </label>
              </div>

              <label>
                Izoh
                <textarea
                  rows="3"
                  value={form.driverComment}
                  onChange={(e) =>
                    updateField("driverComment", e.target.value)
                  }
                  placeholder="Qo‘shimcha izoh..."
                />
              </label>

              <label>
                Jami narx
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    updateField("price", e.target.value)
                  }
                  placeholder="Jami narx"
                />
              </label>
            </div>

            <div className="driver-pickup-modal__actions">
              <button
                type="button"
                className="driver-pickup-secondary-button"
                onClick={closeModal}
              >
                Bekor qilish
              </button>

              <button
                type="button"
                className="driver-pickup-primary-button"
                onClick={() => {
                  // Keyingi bosqichda Firebase saqlash funksiyasi ulanadi.
                  console.log("Driver form:", {
                    orderId: editingOrder.firebaseId,
                    form,
                  });
                }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}