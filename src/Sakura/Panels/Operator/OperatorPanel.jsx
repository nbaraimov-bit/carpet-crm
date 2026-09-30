import "./Operatorpanel.css";

import LocationIcon from "../../MainIcons/LocationIcon";
import PhoneIcon from "../../MainIcons/PhoneIcon";
import UserIcon from "../../MainIcons/UserIcon";
import CommentIcon from "../../MainIcons/CommentIcon";

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
  const [comment, setComment] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] =  useState("")
  const [editingId, setEditingId] = useState(null)
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editComment, setEditComment] = useState("")
  const [deleteOrderId, setDeleteOrderId] = useState(null) 
  const [tarif, setTarif] = useState("standart")

  {/* ===== add order ===== */}
  const addOrder = async () => {
  
    if (!phone || !address) return
  
    const customersSnapshot = await getDocs(
      collection(
        db,
        "customers"
      )
    )
  
    const customers = customersSnapshot.docs.map(
      (doc) => ({
        firebaseId: doc.id,
        ...doc.data(),
      })
    )
  
    const existingCustomer = customers.find(
      (c) => c.phone === phone
    )
  
    let customerId = ""
  
    if (existingCustomer) {
      customerId = existingCustomer.customerId
    } else {
      const nextCustomerNumber = customers.length + 1
  
      customerId = `C${String(
        nextCustomerNumber
      ).padStart(4, "0")}`
  
      await setDoc(
        doc(
          db, "customers", customerId
        ), {
          customerId,
          phone,
          address,
          ordersCount: 1,
          createdAt: serverTimestamp(),
        }
      )
  
    }
  
    const counterRef = doc(
      db,
      "counters",
      "orders"
    )
  
    const counterSnap = await getDoc(counterRef)
    const lastOrderNumber = Number( counterSnap.data() ?.lastOrderNumber) || 0
    const nextOrderNumber = lastOrderNumber + 1
  
    await updateDoc(counterRef,{
      lastOrderNumber: nextOrderNumber
    })
  
    const orderId = `AA${String(
      nextOrderNumber
    ).padStart(4, "0")}`
  
    const newOrder = {
      id: orderId,
      customerId,
      phone,
      address,
      status: "Yangi",
      comment,
      tarif,
      driverNotified: false,
      createdAt: serverTimestamp()
    }
  
    await setDoc(
      doc(db, "orders", orderId),
      newOrder
    )
    setPhone("")
    setAddress("")
    setComment("")
  }

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

  return (
    <div className="operator-page">

      <div className="operator-header">
        <div>
          <h1>Operator</h1>
          <p>Buyurtmalar boshqaruvi</p>
        </div>

        <button className="operator-new-order">
          + Yangi buyurtma
        </button>
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

            return (
              <div
                className="operator-order-card"
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
                  </div>
      
                </div>

                {order.comment && (
                  <div className="operator-comment">
                    <CommentIcon />

                    <span>{order.comment}</span>
                  </div> 
                )}
      
      
                {/* DATE */}
                <div className="operator-order-date">
                  🕐 {formatOrderDate(order.createdAt)}
                </div>
      
              </div>
            )
          })}

        </div>

      </div>

    </div>
  )

}