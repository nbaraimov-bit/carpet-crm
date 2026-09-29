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

import { db } from "../firebase"

export default function OperatorPanel({
  orders
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

  return(
    <div>
      Operator Panel
    </div>
  )

}