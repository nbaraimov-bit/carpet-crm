import React from "react"
import "./DeleteOrderModal.css"

import { db } from "../../../../firebase"

import {
  doc,
  deleteDoc,
} from "firebase/firestore"

const DeleteOrderModal = ({
  deleteOrderId,
  setDeleteOrderId,
  runAction,
  loading,
}) => {

  const deleteOrder = async () => {
    if (!deleteOrderId) return

    await deleteDoc(
      doc(db, "orders", deleteOrderId)
    )
  }

  if (!deleteOrderId) return null

  return (
    <div className="delete-order-modal-overlay">
      <div className="delete-order-modal">

        <div className="delete-order-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 7H20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M9 7V5.5C9 4.7 9.7 4 10.5 4H13.5C14.3 4 15 4.7 15 5.5V7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M6.5 7L7.2 18.2C7.25 19.2 8.1 20 9.1 20H14.9C15.9 20 16.75 19.2 16.8 18.2L17.5 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 10.5V16.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M14 10.5V16.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2>Buyurtmani o‘chirish?</h2>

        <p>
          Bu buyurtma butunlay o‘chiriladi.
          <br />
          Bu amalni ortga qaytarib bo‘lmaydi.
        </p>

        <div className="delete-order-actions">

          <button
            className="delete-order-cancel"
            onClick={() => setDeleteOrderId(null)}
          >
            Yo‘q
          </button>

          <button
            className="delete-order-confirm"
            disabled={loading?.deleteOrder}
            onClick={() => {
              runAction("deleteOrder", async () => {
                await deleteOrder()
                setDeleteOrderId(null)
              })
            }}
          >
            {loading?.deleteOrder
              ? "⏳ O‘chirilmoqda..."
              : "Ha, o‘chirish"}
          </button>

        </div>

      </div>
    </div>
  )
}

export default DeleteOrderModal