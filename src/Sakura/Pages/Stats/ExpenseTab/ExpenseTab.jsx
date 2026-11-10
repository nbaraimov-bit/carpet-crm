import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { ensureExpenseDocument } from "../expenseUtils";
import { formatStatsNumber, getTashkentDateId } from "../statsUtils";
import "./ExpenseTab.css";

const expenseCategories = [
  "⛽ Yoqilg‘i",
  "🧴 Shampun",
  "🧺 Yuvish vositasi",
  "⚡ Kommunal to‘lov",
  "📦 Rulon paket",
  "📦 Adyol upakovka",
  "🖨 Reklama",
  "🍲 Ovqat",
  "Boshqa",
];

function emptyFund() {
  return { openingFund: 0, earnedToday: 0, spentToday: 0, remainingFund: 0 };
}

function ExpenseModal({ onClose, onSave, saving, currentWorker }) {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const selectedCategory = category === "Boshqa" ? customCategory.trim() : category;
    onSave({ category: selectedCategory, amount, note, currentWorker });
  };

  return (
    <div className="expense-modal-overlay" onClick={onClose}>
      <form className="expense-modal" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <div className="expense-modal-heading">
          <span className="expense-modal-mark" aria-hidden="true">＋</span>
          <div>
            <p>BUGUNGI XARAJAT</p>
            <h2>Xarajat qo‘shish</h2>
          </div>
          <button type="button" className="expense-modal-close" onClick={onClose} aria-label="Yopish">×</button>
        </div>

        <label className="expense-field">
          <span>Kategoriya</span>
          <select required value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Kategoriyani tanlang</option>
            {expenseCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        {category === "Boshqa" && (
          <label className="expense-field">
            <span>Kategoriya nomi</span>
            <input required value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="Masalan, ta’mirlash" />
          </label>
        )}
        <label className="expense-field">
          <span>Summa</span>
          <input required min="1" type="number" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" />
        </label>
        <label className="expense-field">
          <span>Izoh <small>(ixtiyoriy)</small></span>
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Xarajat haqida" />
        </label>

        <div className="expense-modal-buttons">
          <button type="button" className="expense-cancel-btn" onClick={onClose}>Bekor qilish</button>
          <button type="submit" className="expense-save-btn" disabled={saving}>
            {saving ? "Saqlanmoqda…" : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ExpenseTab({ currentWorker, compact = false }) {
  const today = useMemo(() => getTashkentDateId(), []);
  const [fund, setFund] = useState(emptyFund);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => onSnapshot(
    doc(db, "expenses", today),
    (snapshot) => {
      setFund(snapshot.exists() ? { ...emptyFund(), ...snapshot.data() } : emptyFund());
      setLoading(false);
    },
    (snapshotError) => {
      setError(snapshotError.message || "Chiqim fondini yuklab bo‘lmadi.");
      setLoading(false);
    }
  ), [today]);

  useEffect(() => {
    if (compact) return undefined;
    const itemsQuery = query(
      collection(db, "expenses", today, "items"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(itemsQuery, (snapshot) => {
      setItems(snapshot.docs.map((expenseDocument) => ({ id: expenseDocument.id, ...expenseDocument.data() })));
    }, (snapshotError) => setError(snapshotError.message || "Xarajatlar ro‘yxatini yuklab bo‘lmadi."));
  }, [compact, today]);

  const saveExpense = async ({ category, amount, note }) => {
    const numericAmount = Number(amount);
    if (!category) {
      setError("Kategoriyani tanlang.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Summani to‘g‘ri kiriting.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const expenseRef = await ensureExpenseDocument(today);
      await addDoc(collection(expenseRef, "items"), {
        category,
        amount: numericAmount,
        note: note.trim(),
        createdAt: serverTimestamp(),
        worker: currentWorker?.phone || "",
      });
      await updateDoc(expenseRef, {
        spentToday: increment(numericAmount),
        currentFund: increment(-numericAmount),
        remainingFund: increment(-numericAmount),
      });
      setShowModal(false);
    } catch (saveError) {
      console.error("Xarajatni saqlashda xatolik:", saveError);
      setError("Xarajatni saqlab bo‘lmadi. Qayta urinib ko‘ring.");
    } finally {
      setSaving(false);
    }
  };

  const addExpenseButton = (
    <button type="button" className="add-expense-btn" onClick={() => { setError(""); setShowModal(true); }}>
      <span aria-hidden="true">＋</span> Xarajat qo‘shish
    </button>
  );

  return (
    <>
      {compact ? (
        <section className="expense-compact-card">
          <div>
            <span className="expense-compact-label">Chiqim fondi</span>
            <strong>{loading ? "…" : `${formatStatsNumber(fund.remainingFund)} so‘m`}</strong>
          </div>
          {addExpenseButton}
        </section>
      ) : (
        <section className="expense-tab">
          <div className="expense-tab-heading">
            <div>
              <p>BUGUNGI MOLIYA</p>
              <h2>Chiqim fondi</h2>
            </div>
            <span className="expense-tab-date">{today}</span>
          </div>

          <div className="expense-fund-grid" aria-busy={loading}>
            <article className="expense-fund-card opening"><span>Boshlang‘ich</span><strong>{loading ? "—" : formatStatsNumber(fund.openingFund)}</strong><small>so‘m</small></article>
            <article className="expense-fund-card earned"><span>Qo‘shildi</span><strong>{loading ? "—" : formatStatsNumber(fund.earnedToday)}</strong><small>so‘m</small></article>
            <article className="expense-fund-card spent"><span>Ishlatildi</span><strong>{loading ? "—" : formatStatsNumber(fund.spentToday)}</strong><small>so‘m</small></article>
            <article className="expense-fund-card remaining"><span>Mavjud</span><strong>{loading ? "—" : formatStatsNumber(fund.remainingFund)}</strong><small>so‘m</small></article>
          </div>

          {addExpenseButton}

          <section className="expense-history-card">
            <div className="expense-history-heading">
              <div><h3>Bugungi xarajatlar</h3><p>Kiritilgan xarajatlar ro‘yxati</p></div>
              <span>{items.length}</span>
            </div>
            {items.length === 0 ? (
              <div className="expense-empty">Bugun hali xarajat qo‘shilmagan.</div>
            ) : (
              <div className="expense-history-list">
                {items.map((item) => (
                  <article className="expense-item-card" key={item.id}>
                    <div className="expense-item-top">
                      <span className="expense-category">{item.category}</span>
                      <strong className="expense-amount">−{formatStatsNumber(item.amount)} so‘m</strong>
                    </div>
                    {item.note && <p className="expense-note">{item.note}</p>}
                    <div className="expense-footer">
                      <span>{item.worker || "Xodim"}</span>
                      <time>{item.createdAt?.toDate?.().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }) || ""}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      )}

      {error && <div className="expense-error" role="alert">{error}</div>}
      {showModal && (
        <ExpenseModal
          currentWorker={currentWorker}
          onClose={() => !saving && setShowModal(false)}
          onSave={saveExpense}
          saving={saving}
        />
      )}
    </>
  );
}
