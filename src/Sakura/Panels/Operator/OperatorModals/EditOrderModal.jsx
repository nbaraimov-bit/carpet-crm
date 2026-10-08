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
  editingId,
  setEditingId,
  editPhone,
  setEditPhone,
  editAddress,
  setEditAddress,
  editComment,
  setEditComment,
  editCarpetCount,
  setEditCarpetCount,
  editKvm,
  setEditKvm,
  editBlanketCount,
  setEditBlanketCount,
  editYakandozCount,
  setEditYakandozCount,
  editPrice,
  setEditPrice,
  runAction,
  loading,
}) => {

  const saveEdit = async () => {
    if (!editingId) return

    await updateDoc(
      doc(db, "orders", editingId),
      {
        phone: editPhone,
        address: editAddress,
        comment: editComment,

        carpetCount: Number(editCarpetCount || 0),
        kvm: Number(editKvm || 0),
        blanketCount: Number(editBlanketCount || 0),
        yakandozCount: Number(editYakandozCount || 0),
        price: Number(editPrice || 0),
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

          <div className="edit-products-section">
  <div className="edit-products-title">
    Mahsulotlar
  </div>

  <div className="edit-products-grid">

    <label>
      Gilam soni
      <input
        type="number"
        min="0"
        value={editCarpetCount}
        onChange={(e) => setEditCarpetCount(e.target.value)}
        placeholder="0"
      />
    </label>

    <label>
      Gilam m²
      <input
        type="number"
        min="0"
        value={editKvm}
        onChange={(e) => setEditKvm(e.target.value)}
        placeholder="0"
      />
    </label>

    <label>
      Adyol soni
      <input
        type="number"
        min="0"
        value={editBlanketCount}
        onChange={(e) => setEditBlanketCount(e.target.value)}
        placeholder="0"
      />
    </label>

    <label>
      Yakandoz soni
      <input
        type="number"
        min="0"
        value={editYakandozCount}
        onChange={(e) => setEditYakandozCount(e.target.value)}
        placeholder="0"
      />
    </label>

  </div>
</div>

<label>
  Jami narx
  <input
    type="number"
    min="0"
    value={editPrice}
    onChange={(e) => setEditPrice(e.target.value)}
    placeholder="0"
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