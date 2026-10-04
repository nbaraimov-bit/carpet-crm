import React from "react"
import "./EditOrderModal.css"

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

const EditOrderModal = ({
  runAction,
  loading,
}) => {

  const [editingId, setEditingId] = useState(null)
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editComment, setEditComment] = useState("")

  const saveEdit = async () => {
  if (!editingId) return

  await updateDoc(
    doc(db, "orders", editingId),
    {
      phone: editPhone,
      address: editAddress,
      comment: editComment,
    }
  )
}


  if (!editingId) return null

  return (
    <div className="edit-order-modal-overlay">
      <div className="edit-order-modal">

        <div className="edit-order-modal-header">
          <div>
            <h2>Buyurtmani tahrirlash</h2>
            <p>Mijoz ma'lumotlarini o'zgartiring</p>
          </div>
        </div>

        <div className="edit-order-form">

          <label>
            Telefon raqam
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="+998..."
            />
          </label>

          <label>
            Manzil
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="Manzilni kiriting"
            />
          </label>

          <label>
            Izoh
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Izoh..."
            />
          </label>

          <div className="edit-order-modal-actions">

            <button
              className="edit-order-cancel"
              onClick={() => setEditingId(null)}
            >
              Bekor
            </button>

            <button
              className="edit-order-save"
              disabled={loading?.editOrder}
              onClick={() => {
                runAction("editOrder", async () => {
                  await saveEdit()
                  setEditingId(null)
                })
              }}
            >
              {loading?.editOrder
                ? "⏳ Saqlanmoqda..."
                : "Saqlash"}
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default EditOrderModal