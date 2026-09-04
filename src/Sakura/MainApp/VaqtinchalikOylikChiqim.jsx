import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

function VaqtinchalikOylikChiqim() {
  const [fond, setFond] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const yuklash = async () => {
      try {
        setLoading(true);
        setError("");

        const hozir = new Date();

        const KunOldin = new Date(hozir);
        KunOldin.setDate(KunOldin.getDate() - 30);

        let jamiEarningToday = 0;
        let barchaItems = [];

        // expenses collection
        const expensesSnapshot = await getDocs(
          collection(db, "expenses")
        );

        for (const expenseDoc of expensesSnapshot.docs) {
          const sana = expenseDoc.id;

          // Document ID YYYY-MM-DD ko'rinishida
          const expenseDate = new Date(`${sana}T23:59:59`);

          // Sana noto'g'ri bo'lsa o'tkazib yuboramiz
          if (Number.isNaN(expenseDate.getTime())) {
            continue;
          }

          // Faqat oxirgi 30 kun
          if (
            expenseDate < KunOldin ||
            expenseDate > hozir
          ) {
            continue;
          }

          const data = expenseDoc.data();

          // =========================
          // earningToday
          // =========================

          const earningToday = Number(
            String(data.earningToday ?? 0)
              .replace(/\s/g, "")
              .replace(",", ".")
          );

          if (Number.isFinite(earningToday)) {
            jamiEarningToday += earningToday;
          }

          // =========================
          // items subcollection
          // =========================

          const itemsSnapshot = await getDocs(
            collection(
              db,
              "expenses",
              expenseDoc.id,
              "items"
            )
          );

          itemsSnapshot.forEach((itemDoc) => {
            const itemData = itemDoc.data();

            const amount = Number(
              String(itemData.amount ?? 0)
                .replace(/\s/g, "")
                .replace(",", ".")
            );

            let createdAt = null;

            if (itemData.createdAt) {
              if (
                typeof itemData.createdAt?.toDate ===
                "function"
              ) {
                createdAt =
                  itemData.createdAt.toDate();
              } else {
                createdAt = new Date(
                  itemData.createdAt
                );
              }
            }

            barchaItems.push({
              id: `${expenseDoc.id}-${itemDoc.id}`,

              category:
                itemData.category ||
                "Noma'lum",

              amount: Number.isFinite(amount)
                ? amount
                : 0,

              createdAt,

              note:
                itemData.note ||
                "",

              worker:
                itemData.worker ||
                "",
            });
          });
        }

        // Eng yangi chiqim tepada
        barchaItems.sort((a, b) => {
          const dateA =
            a.createdAt?.getTime?.() || 0;

          const dateB =
            b.createdAt?.getTime?.() || 0;

          return dateB - dateA;
        });

        setFond(jamiEarningToday);
        setItems(barchaItems);

      } catch (err) {
        console.error(
          "Vaqtinchalik oylik chiqim xatosi:",
          err
        );

        setError(
          "Oylik chiqim ma'lumotlarini yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
      }
    };

    yuklash();
  }, []);

  // Pul formatlash
  const pul = (son) => {
    return `${Math.round(son).toLocaleString(
      "uz-UZ"
    )} so'm`;
  };

  // Sana formatlash
  const sanaFormat = (date) => {
    if (!date) return "—";
const kun = String(
      date.getDate()
    ).padStart(2, "0");

    const oy = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const yil = date.getFullYear();

    return `${kun}.${oy}.${yil}`;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Oylik chiqim yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            💸 Oylik chiqim
          </div>

          <div style={styles.subtitle}>
            Oxirgi 30 kun
          </div>
        </div>
      </div>


      {/* OYLIK CHIQIM FONDI */}
      <div style={styles.fondCard}>

        <div style={styles.fondLabel}>
          💰 Oylik chiqim fondi
        </div>

        <div style={styles.fondValue}>
          {pul(fond)}
        </div>

        <div style={styles.fondInfo}>
          Oxirgi 30 kundagi earningToday yig'indisi
        </div>

      </div>


      {/* CHIQIMLAR */}
      <div style={styles.listTitle}>
        📋 Ishlatilgan mablag'lar
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>
          Oxirgi 30 kunda chiqim topilmadi.
        </div>
      ) : (
        <div style={styles.list}>

          {items.map((item, index) => (
            <div
              key={item.id}
              style={styles.itemCard}
            >

              <div style={styles.itemTop}>

                <div style={styles.category}>
                  {item.category}
                </div>

                <div style={styles.amount}>
                  {pul(item.amount)}
                </div>

              </div>


              <div style={styles.itemBottom}>

                <span>
                  📅{" "}
                  {sanaFormat(item.createdAt)}
                </span>

                {item.worker && (
                  <span>
                    👤 {item.worker}
                  </span>
                )}

              </div>


              {item.note && (
                <div style={styles.note}>
                  📝 {item.note}
                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}


const styles = {

  container: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px",
    marginTop: "10px",
    color: "#ffffff",
  },

  header: {
    marginBottom: "14px",
  },

  title: {
    fontSize: "23px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "4px",
    fontSize: "14px",
    color: "#aaa9c7",
  },


  // =========================
  // FOND CARD
  // =========================

  fondCard: {
    padding: "20px",
    borderRadius: "18px",

    background:
      "linear-gradient(135deg, rgba(65,20,100,0.95), rgba(18,15,48,0.98))",

    border:
      "1px solid rgba(184,72,255,0.85)",

    boxShadow:
      "0 0 20px rgba(174,54,255,0.25)",

    textAlign: "center",
  },

  fondLabel: {
    fontSize: "16px",
    color: "#d7b7ff",
  },

  fondValue: {
    marginTop: "8px",
    fontSize: "29px",
    fontWeight: "800",
  },

  fondInfo: {
    marginTop: "7px",
    fontSize: "11px",
    color: "#aaa6c5",
  },


  // =========================
  // LIST
  // =========================

  listTitle: {
    marginTop: "20px",
    marginBottom: "10px",

    fontSize: "19px",
    fontWeight: "700",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  itemCard: {
    padding: "13px 15px",

    borderRadius: "14px",

    background:
      "linear-gradient(145deg, rgba(34,27,70,0.95), rgba(15,15,43,0.98))",

    border:
      "1px solid rgba(174,77,255,0.55)",

    boxShadow:
      "0 0 10px rgba(153,51,255,0.12)",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  category: {
    fontSize: "16px",
    fontWeight: "600",
  },
amount: {
    fontSize: "15px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  itemBottom: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",

    marginTop: "7px",

    fontSize: "12px",
    color: "#aaa9c7",
  },

  note: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#bcb8d2",
  },

  empty: {
    padding: "20px",
    textAlign: "center",

    borderRadius: "14px",

    border:
      "1px solid rgba(174,77,255,0.4)",

    color: "#aaa9c7",
  },

  loading: {
    padding: "25px",
    textAlign: "center",
    color: "#c987ff",
  },

  error: {
    margin: "15px",
    padding: "15px",

    borderRadius: "12px",

    background:
      "rgba(255,0,0,0.12)",

    border:
      "1px solid #ff4444",

    color: "#ff7777",
  },
};


export default VaqtinchalikOylikChiqim;