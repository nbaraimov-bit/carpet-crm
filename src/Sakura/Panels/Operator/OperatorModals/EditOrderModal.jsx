import "./EditOrderModal.css"

import { db } from "../../../../firebase"
import {
  doc,
  updateDoc,
  deleteField,
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
  editKvmPro,
  setEditKvmPro,
  editBlanketCount,
  setEditBlanketCount,
  editBlanket2x,
  setEditBlanket2x,
  editMatras,
  setEditMatras,
  editYakandozCount,
  setEditYakandozCount,
  editYakandozS,
  setEditYakandozS,
  editYakandozL,
  setEditYakandozL,
  editPrice,
  setEditPrice,
  runAction,
  loading,
}) => {

  const saveEdit = async () => {
    if (!editingId) return

    const updates = {
      phone: editPhone.trim() || deleteField(),
      address: editAddress.trim() || deleteField(),
      comment: editComment.trim() || deleteField(),
    }
    const readQuantity = (value) => {
      if (value === undefined || value === null || String(value).trim() === "") return 0
      const quantity = Number(value)
      return Number.isFinite(quantity) && quantity > 0 ? quantity : 0
    }
    const saveQuantity = (field, value) => {
      const quantity = readQuantity(value)
      updates[field] = quantity > 0 ? quantity : deleteField()
      return quantity
    }

    const carpetCount = saveQuantity("carpetCount", editCarpetCount)
    const kvmSt = saveQuantity("kvmSt", editKvm)
    const kvmPro = saveQuantity("kvmPro", editKvmPro)
    const kvm = kvmSt + kvmPro
    updates.kvm = kvm > 0 ? kvm : deleteField()

    const blanket1x = saveQuantity("blanket1x", editBlanketCount)
    const blanket2x = saveQuantity("blanket2x", editBlanket2x)
    const matras = saveQuantity("matras", editMatras)
    const blanketCount = blanket1x + blanket2x + matras
    updates.blanketCount = blanketCount > 0 ? blanketCount : deleteField()

    const yakandozM = saveQuantity("yakandozM", editYakandozCount)
    const yakandozS = saveQuantity("yakandozS", editYakandozS)
    const yakandozL = saveQuantity("yakandozL", editYakandozL)
    const yakandozCount = yakandozM + yakandozS + yakandozL
    updates.yakandozCount = yakandozCount > 0 ? yakandozCount : deleteField()

    const price = readQuantity(editPrice)
    updates.price = price > 0 ? price : deleteField()

    if (carpetCount + kvm === 0) {
      updates.carpetStatus = deleteField()
      updates.carpetWasherTeamId = deleteField()
      updates.carpetWasherTeamName = deleteField()
      updates.carpetDate = deleteField()
    }
    if (blanketCount === 0) {
      updates.blanketStatus = deleteField()
      updates.blanketWasherTeamId = deleteField()
      updates.blanketWasherTeamName = deleteField()
      updates.blanketDate = deleteField()
    }
    if (yakandozCount === 0) {
      updates.yakandozStatus = deleteField()
      updates.yakandozWasherTeamId = deleteField()
      updates.yakandozWasherTeamName = deleteField()
      updates.yakandozDate = deleteField()
    }
    if (carpetCount + kvm + blanketCount + yakandozCount === 0) {
      updates.packingTeamId = deleteField()
      updates.packingTeamName = deleteField()
    }

    await updateDoc(doc(db, "orders", editingId), updates)
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
      <input type="number" min="0" value={editCarpetCount} onChange={(e) => setEditCarpetCount(e.target.value)} placeholder="0" />
    </label>

    <label>
      KVM (ST)
      <input type="number" min="0" step="any" value={editKvm} onChange={(e) => setEditKvm(e.target.value)} placeholder="0" />
    </label>

    <label>
      KVM (PRO)
      <input type="number" min="0" step="any" value={editKvmPro} onChange={(e) => setEditKvmPro(e.target.value)} placeholder="0" />
    </label>

    <label>
      Adyol (1x)
      <input type="number" min="0" value={editBlanketCount} onChange={(e) => setEditBlanketCount(e.target.value)} placeholder="0" />
    </label>

    <label>
      Adyol (2x)
      <input type="number" min="0" value={editBlanket2x} onChange={(e) => setEditBlanket2x(e.target.value)} placeholder="0" />
    </label>

    <label>
      Matras
      <input type="number" min="0" value={editMatras} onChange={(e) => setEditMatras(e.target.value)} placeholder="0" />
    </label>

    <label>
      Yakandoz (M)
      <input type="number" min="0" value={editYakandozCount} onChange={(e) => setEditYakandozCount(e.target.value)} placeholder="0" />
    </label>

    <label>
      Yakandoz (S)
      <input type="number" min="0" value={editYakandozS} onChange={(e) => setEditYakandozS(e.target.value)} placeholder="0" />
    </label>

    <label>
      Yakandoz (L)
      <input type="number" min="0" value={editYakandozL} onChange={(e) => setEditYakandozL(e.target.value)} placeholder="0" />
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
