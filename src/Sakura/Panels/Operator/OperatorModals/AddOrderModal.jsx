import "./AddOrderModal.css";


import { db } from "../../../../firebase"
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


export default function AddOrderModal({

  newOrderModalOpen,
  setNewOrderModalOpen,
  runAction,
  loading,
}) {

  const [comment, setComment] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] =  useState("")
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


  if (!newOrderModalOpen) return null

  return (
    <div className="new-order-modal-overlay">

      <div className="new-order-modal">

        <div className="new-order-modal-header">
          <h2>Yangi buyurtma</h2>
          <p>Yangi mijoz buyurtmasini kiriting</p>
        </div>

        <div className="new-order-form">

          <label>
            Telefon raqam
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998..."
            />
          </label>

          <label>
            Manzil
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Manzilni kiriting"
            />
          </label>

          <label>
            Izoh
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Izoh..."
            />
          </label>


          <div className="tarif-selector">

            <button
              type="button"
              className={`tarif-option ${
                tarif === "standart" ? "active" : ""
              }`}
              onClick={() => setTarif("standart")}
            >
              Standart
            </button>
          
            <button
              type="button"
              className={`tarif-option ${
                tarif === "tezkor" ? "active" : ""
              }`}
              onClick={() => setTarif("tezkor")}
            >
              Tezkor
            </button>
          
          </div>          


          <div className="new-order-modal-actions">

            <button
              className="new-order-cancel"
              onClick={() => setNewOrderModalOpen(false)}
            >
              Bekor
            </button>

            <button
              className="new-order-create"
              disabled={loading?.addOrder}
              onClick={() => {
                runAction("addOrder", async () => {
                  await addOrder()
                  setNewOrderModalOpen(false)
                })
              }}
            >
              {loading?.addOrder
                ? "⏳ Saqlanmoqda..."
                : "Yaratish"}
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}