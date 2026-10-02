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

  phone,
  setPhone,

  address,
  setAddress,

  comment,
  setComment,

  addOrder
}) {

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

          <div className="new-order-modal-actions">

            <button
              className="new-order-cancel"
              onClick={() => setNewOrderModalOpen(false)}
            >
              Bekor
            </button>

            <button
              className="new-order-create"
              onClick={async () => {
                await addOrder()
                setNewOrderModalOpen(false)
              }}
            >
              Yaratish
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}