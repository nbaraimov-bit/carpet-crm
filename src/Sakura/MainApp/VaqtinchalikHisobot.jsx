import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

function VaqtinchalikHisobot() {
  const [hisobot, setHisobot] = useState({
    jamiSumma: 0,
    jamiGilam: 0,
    jamiAdyol: 0,
    jamiYakandoz: 0,
    sofFoyda: 0,
  });

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

        const boshlanish = Timestamp.fromDate(KunOldin);

        const q = query(
          collection(db, "archives"),
          where("archiveDate", ">=", boshlanish)
        );

        const snapshot = await getDocs(q);

        let jamiSumma = 0;
        let jamiGilam = 0;
        let jamiAdyol = 0;
        let jamiYakandoz = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();

          // Jami summa
          const price = Number(
            String(data.price ?? 0)
              .replace(/\s/g, "")
              .replace(",", ".")
          );

          // Gilamning KV.M
          // carpetCount emas!
          const kvm = Number(
            String(data.kvm ?? 0)
              .replace(/\s/g, "")
              .replace(",", ".")
          );

          // Adyol soni
          const blanketCount = Number(
            String(data.blanketCount ?? 0)
              .replace(/\s/g, "")
              .replace(",", ".")
          );

          // Yakandoz soni
          const yakandozCount = Number(
            String(data.yakandozCount ?? 0)
              .replace(/\s/g, "")
              .replace(",", ".")
          );

          if (Number.isFinite(price)) {
            jamiSumma += price;
          }

          if (Number.isFinite(kvm)) {
            jamiGilam += kvm;
          }

          if (Number.isFinite(blanketCount)) {
            jamiAdyol += blanketCount;
          }

          if (Number.isFinite(yakandozCount)) {
            jamiYakandoz += yakandozCount;
          }
        });

        // Sof foyda:
        //
        // Jami summa
        // - (gilam m² × 6000)
        // - (adyol × 23500)
        // - (yakandoz × 22500)

        const sofFoyda =
          jamiSumma -
          jamiGilam * 6000 -
          jamiAdyol * 23500 -
          jamiYakandoz * 22500;

        setHisobot({
          jamiSumma,
          jamiGilam,
          jamiAdyol,
          jamiYakandoz,
          sofFoyda,
        });
      } catch (err) {
        console.error("Vaqtinchalik hisobot xatosi:", err);
        setError("Hisobot ma'lumotlarini yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    yuklash();
  }, []);

  const pul = (son) =>
    `${Math.round(son).toLocaleString("uz-UZ")} so'm`;

  const kvm = (son) =>
    `${Number(son.toFixed(2)).toLocaleString("uz-UZ")} m²`;

  if (loading) {
    return (
      <div style={styles.loading}>
        Hisobot yuklanmoqda...
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

      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            📊 Vaqtinchalik hisobot
          </div>

          <div style={styles.subtitle}>
            Oxirgi 30 kun
          </div>
        </div>
      </div>

      <div style={styles.grid}>

        {/* JAMI SUMMA */}
        <div style={styles.card}>
          <div style={styles.icon}>💰</div>

          <div style={styles.cardTitle}>
            Jami summa
          </div>

          <div style={styles.money}>
            {pul(hisobot.jamiSumma)}
          </div>
        </div>


        {/* JAMI GILAM */}
        <div style={styles.card}>
          <div style={styles.icon}>🧶</div>
          <div style={styles.cardTitle}>
            Jami gilam
          </div>

          <div style={styles.value}>
            {kvm(hisobot.jamiGilam)}
          </div>
        </div>


        {/* JAMI ADYOL */}
        <div style={styles.card}>
          <div style={styles.icon}>🛏️</div>

          <div style={styles.cardTitle}>
            Jami adyol
          </div>

          <div style={styles.value}>
            {hisobot.jamiAdyol} ta
          </div>
        </div>


        {/* JAMI YAKANDOZ */}
        <div style={styles.card}>
          <div style={styles.icon}>🧺</div>

          <div style={styles.cardTitle}>
            Jami yakandoz
          </div>

          <div style={styles.value}>
            {hisobot.jamiYakandoz} ta
          </div>
        </div>

      </div>


      {/* SOF FOYDA */}
      <div style={styles.profitCard}>

        <div style={styles.profitLabel}>
          💎 Sof foyda
        </div>

        <div style={styles.profitValue}>
          {pul(hisobot.sofFoyda)}
        </div>

        <div style={styles.formula}>
          Jami summa − (gilam m² × 6 000)
          − (adyol × 23 500)
          − (yakandoz × 22 500)
        </div>

      </div>

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "5px",
    fontSize: "14px",
    color: "#aaa9c7",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  card: {
    background:
      "linear-gradient(145deg, rgba(34,27,70,0.95), rgba(15,15,43,0.98))",

    border: "1px solid rgba(174,77,255,0.65)",
    borderRadius: "16px",

    padding: "15px",

    minHeight: "125px",

    boxSizing: "border-box",

    boxShadow:
      "0 0 12px rgba(153,51,255,0.18)",
  },

  icon: {
    fontSize: "25px",
    marginBottom: "8px",
  },

  cardTitle: {
    fontSize: "14px",
    color: "#b9b5d5",
    marginBottom: "7px",
  },

  value: {
    fontSize: "21px",
    fontWeight: "700",
  },

  money: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#d59aff",
  },

  profitCard: {
    marginTop: "12px",

    padding: "18px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, rgba(65,20,100,0.95), rgba(18,15,48,0.98))",

    border: "1px solid rgba(184,72,255,0.85)",

    boxShadow:
      "0 0 20px rgba(174,54,255,0.25)",

    textAlign: "center",
  },

  profitLabel: {
    fontSize: "17px",
    color: "#d7b7ff",
    marginBottom: "8px",
  },

  profitValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffffff",
  },

  formula: {
    marginTop: "10px",
    fontSize: "11px",
    lineHeight: "1.5",
    color: "#aaa6c5",
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
    background: "rgba(255,0,0,0.12)",
    border: "1px solid #ff4444",
    color: "#ff7777",
  },
};

export default VaqtinchalikHisobot;