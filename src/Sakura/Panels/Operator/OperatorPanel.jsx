import "./Operatorpanel.css";

import AddOrderModal from "./OperatorModals/AddOrderModal";
import EditOrderModal from "./OperatorModals/EditOrderModal";

import {
  LocationIcon,
  PhoneIcon,
  UserIcon,
  CommentIcon,
  PriceIcon,
  TimeIcon,
 } from "../../MainIcons/SvgIcons";


import CarpetIcon from "../../MainIcons/carpetIcon.png"
import BlanketIcon from "../../MainIcons/blanketIcon.png"
import YakandozIcon from "../../MainIcons/yakandozIcon.png"
import CurtainIcon from "../../MainIcons/curtainIcon.png"

import { db } from "../../../firebase"
import { useState } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"


export default function OperatorPanel({
  orders,
  updateStatus,
  setRole,
  role,
  loading,
  runAction
}) {

  const [operatorMode, setOperatorMode] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editComment, setEditComment] = useState("")
  const [editCarpetCount, setEditCarpetCount] = useState("")
  const [editKvm, setEditKvm] = useState("")
  const [editBlanketCount, setEditBlanketCount] = useState("")
  const [editYakandozCount, setEditYakandozCount] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [deleteOrderId, setDeleteOrderId] = useState(null) 
  const [openMenuId, setOpenMenuId] = useState(null)
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false)
  

  const formatOrderDate = (timestamp) => {
    if (!timestamp) return ""

    const date = timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp)

    return date.toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const activeOrders = orders.filter(
    (o) =>
      o.status !== "Yetkazildi" &&
      o.status !== "Rad etildi"
  )

  const finishedOrders = orders.filter(
    (o) =>
      o.status === "Yetkazildi" ||
      o.status === "Rad etildi"
  )

  const getProductStatusClass = (status) => {
    if (!status) return ""

    const value = String(status).toLowerCase()

    if (value === "yangi") return "status-yangi"
    if (
      value === "olingan" ||
      value === "olinmoqda" ||
      value === "yuvilmoqda"
    ) {
      return "status-jarayon"
    }

    if (value === "yuvildi") return "status-yuvildi"
    if (value === "tayyor") return "status-tayyor"

    return ""
  }


  return (
    <div className="operator-page">

      <button
        className="operator-back-button"
        onClick={() => setRole("")}
        aria-label="Bosh menyuga qaytish"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="operator-back-icon"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="operator-header">
        <div>
          <h1>Operator</h1>
          <p>Buyurtmalar boshqaruvi</p>
        </div>
      </div>

      <div className="operator-orders"> 
        <h2>Faol buyurtmalar</h2>

        <div className="operator-order-list">

          {activeOrders.map((order) => {

            const hasCarpet =
              order.carpetCount !== undefined &&
              order.carpetCount !== null &&
              order.carpetCount !== ""

            const hasBlanket =
              order.blanketCount !== undefined &&
              order.blanketCount !== null &&
              order.blanketCount !== ""

            const hasYakandoz =
              order.yakandozCount !== undefined &&
              order.yakandozCount !== null &&
              order.yakandozCount !== ""

            const hasCurtain =
              order.curtainCount !== undefined &&
              order.curtainCount !== null &&
              order.curtainCount !== ""

            const isQuickOrder = order.tarif === "tezkor"

            return (
              <div
                className={`operator-order-card ${
                  isQuickOrder ? "quick-order-card" : ""
                }`}

                key={order.id}
              >

                {/* TOP */}
                <div className="operator-order-top">

                  <div className="operator-order-id">
                    {order.id}
                  </div>

                  <div className="operator-order-status">
                    {order.status}
                  </div>

                </div>
  

                {/* CUSTOMER */}
                <div className="operator-order-info"> 

                  <div className="operator-info-row">
                    <UserIcon/>
                    <span>{order.customerId}</span>
                  </div>

                  <div className="operator-info-row">
                    <PhoneIcon/>
                    <span>{order.phone}</span>
                  </div>

                  <div className="operator-info-row">
                    <LocationIcon/>
                    <span>{order.address}</span>
                  </div>

                </div>
  

                {/* PRODUCTS */}
                <div className="operator-products">

                  <div
                    className={`operator-product ${
                      hasCarpet ? "active" : "inactive"
                    }`}
                  >
                    <img src={CarpetIcon} alt="Gilam" />

                    {hasCarpet && (
                      <span>
                        {order.carpetCount ?? 0} / {order.kvm ?? 0}
                      </span>
                    )}

                    <div
                      className={`product-status-line ${
                        getProductStatusClass(order.carpetStatus)
                      }`}
                    />
                  </div>


                  <div
                    className={`operator-product ${
                      hasBlanket ? "active" : "inactive"
                    }`}
                  >
                    <img src={BlanketIcon} />
                    {hasBlanket && (
                      <span>{order.blanketCount}</span>
                    )}

                    <div
                      className={`product-status-line ${
                        getProductStatusClass(order.blanketStatus)
                      }`}
                    />
                  </div>


                  <div
                    className={`operator-product ${
                      hasYakandoz ? "active" : "inactive"
                    }`}
                  >
                    <img src={YakandozIcon} />
                    {hasYakandoz && (
                      <span>{order.yakandozCount}</span>
                    )}

                    <div
                      className={`product-status-line ${
                        getProductStatusClass(order.yakandozStatus)
                      }`}
                    />
                  </div>


                  <div
                    className={`operator-product ${
                      hasCurtain ? "active" : "inactive"
                    }`}
                  >
                    <img src={CurtainIcon} />
                    {hasCurtain && (
                      <span>{order.curtainCount}</span>
                    )}

                    <div
                      className={`product-status-line ${
                        getProductStatusClass(order.curtainStatus)
                      }`}
                    />
                  </div>
      
                </div>

                <div className="operator-order-price">
                  <PriceIcon />
                  <span>
                    {Number(order.price).toLocaleString("uz-UZ")} so'm
                  </span>
                </div>


                {order.comment && (
                  <div className="operator-comment">
                    <CommentIcon />

                    <span>{order.comment}</span>
                  </div> 
                )}
      
      
                <div className="operator-order-bottom">

                  {/* DATE */}
                  <div className="operator-order-date">
                    <TimeIcon />
                    <span>
                      {formatOrderDate(order.createdAt)}
                    </span>

                  </div>

                  <div className="operator-card-actions">
 
                    <button
                      className="operator-menu-button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === order.id
                            ? null
                            : order.id
                        )
                      }
                    >
                      <svg
                        className={`operator-arrow ${
                          openMenuId === order.id ? "arrow-open" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div
                      className={`operator-action-menu ${
                        openMenuId === order.id ? "menu-open" : ""
                      }`}
                    >
                      <button
                        onClick={() => {
                          setEditingId(order.id)

                          setEditPhone(order.phone || "")
                          setEditAddress(order.address || "")
                          setEditComment(order.comment || "")
                          setEditCarpetCount(order.carpetCount ?? "")
                          setEditKvm(order.kvm ?? "")
                          setEditBlanketCount(order.blanketCount ?? "")
                          setEditYakandozCount(order.yakandozCount ?? "")
                          setEditPrice(order.price ?? "")

                          setOpenMenuId(null)
                        }}
                      >
                        ✎ Tahrirlash
                      </button>

                      <button
                        onClick={() => {
                          setDeleteOrderId(order.id)
                          setOpenMenuId(null)
                        }}
                      >
                        🗑 O‘chirish
                      </button>
                    </div>

                  </div>
                
                </div>
      
              </div>
            )
          })}

        </div>

      </div>

      <div className="new-order-fab">
        <button
          className={`new-order-fab-button ${
            newOrderModalOpen ? "fab-open" : ""
         }`}
          onClick={() => setNewOrderModalOpen(!newOrderModalOpen)}
        >
          <svg
            className="new-order-plus"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5V19"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <AddOrderModal
        newOrderModalOpen={newOrderModalOpen}
        setNewOrderModalOpen={setNewOrderModalOpen}
        runAction={runAction}
        loading={loading}
      />

      <EditOrderModal
        editingId={editingId}
        setEditingId={setEditingId}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        editAddress={editAddress}
        setEditAddress={setEditAddress}
        editComment={editComment}
        setEditComment={setEditComment}
        editCarpetCount={editCarpetCount}
        setEditCarpetCount={setEditCarpetCount}
        editKvm={editKvm}
        setEditKvm={setEditKvm}
        editBlanketCount={editBlanketCount}
        setEditBlanketCount={setEditBlanketCount}
        editYakandozCount={editYakandozCount}
        setEditYakandozCount={setEditYakandozCount}
        editPrice={editPrice}
        setEditPrice={setEditPrice}
        runAction={runAction}
        loading={loading}
      />

    </div>
  )

}