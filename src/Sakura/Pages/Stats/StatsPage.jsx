import { useEffect, useMemo, useState } from "react";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import ExpenseTab from "./ExpenseTab/ExpenseTab";
import StatsTab from "./StatsTab/StatsTab";
import { getStatsRange, getTashkentDateId } from "./statsUtils";
import "./StatsPage.css";

const emptySummary = {
  income: 0,
  salary: 0,
  expenseFund: 0,
  profit: 0,
  orderCount: 0,
  products: {
    carpetKvm: 0,
    blankets: 0,
    yakandoz: 0,
  },
};

const numberOrZero = (value) => {
  const valueAsNumber = Number(String(value ?? 0).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(valueAsNumber) ? valueAsNumber : 0;
};

function getWorkerRows(earningsSnapshots) {
  const workersByPhone = new Map();

  earningsSnapshots.forEach((snapshot) => {
    Object.entries(snapshot.data()).forEach(([phone, earnings]) => {
      if (!earnings || typeof earnings !== "object") return;

      const worker = workersByPhone.get(phone) || {
        phone,
        name: earnings.name || "Xodim",
        driverSalary: 0,
        washerSalary: 0,
        packingSalary: 0,
        totalSalary: 0,
      };

      worker.name = earnings.name || worker.name;
      worker.driverSalary += numberOrZero(earnings.driverSalary);
      worker.washerSalary += numberOrZero(earnings.washerSalary);
      worker.packingSalary += numberOrZero(earnings.packingsalary ?? earnings.packingSalary);
      worker.totalSalary = worker.driverSalary + worker.washerSalary + worker.packingSalary;
      workersByPhone.set(phone, worker);
    });
  });

  return [...workersByPhone.values()].sort((first, second) => second.totalSalary - first.totalSalary);
}

export default function StatsPage({ currentWorker }) {
  const [activeTab, setActiveTab] = useState("stats");
  const today = useMemo(() => getTashkentDateId(), []);
  const [period, setPeriod] = useState("today");
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);
  const [report, setReport] = useState(null);
  const range = useMemo(
    () => getStatsRange(period, today, customStart, customEnd),
    [period, today, customStart, customEnd]
  );

  useEffect(() => {
    if (activeTab !== "stats") return undefined;
    if (!range.isValid) return undefined;

    let isCurrentRequest = true;

    const loadSummary = async () => {
      try {
        const archivesQuery = query(
          collection(db, "archives"),
          where("archiveDate", ">=", range.startDate),
          where("archiveDate", "<=", range.endDate)
        );
        const expenseQuery = query(
          collection(db, "expenses"),
          where(documentId(), ">=", range.startDate),
          where(documentId(), "<=", range.endDate)
        );
        const earningsQuery = query(
          collection(db, "workerEarnings"),
          where(documentId(), ">=", range.startDate),
          where(documentId(), "<=", range.endDate)
        );
        const [archivesSnapshot, expensesSnapshot, earningsSnapshot] = await Promise.all([
          getDocs(archivesQuery),
          getDocs(expenseQuery),
          getDocs(earningsQuery),
        ]);

        const nextSummary = { ...emptySummary, products: { ...emptySummary.products } };
        archivesSnapshot.forEach((archiveDocument) => {
          const order = archiveDocument.data();
          const kvm = numberOrZero(order.kvm);
          const splitKvm = numberOrZero(order.kvmSt) + numberOrZero(order.kvmPro);
          const sizedBlankets = numberOrZero(order.blanket1x)
            + numberOrZero(order.blanket2x)
            + numberOrZero(order.matras);
          const sizedYakandoz = numberOrZero(order.yakandozM)
            + numberOrZero(order.yakandozS)
            + numberOrZero(order.yakandozL);

          nextSummary.income += numberOrZero(order.price);
          nextSummary.salary += numberOrZero(order.totalSalary);
          nextSummary.products.carpetKvm += kvm || splitKvm;
          nextSummary.products.blankets += sizedBlankets || numberOrZero(order.blanketCount);
          nextSummary.products.yakandoz += sizedYakandoz || numberOrZero(order.yakandozCount);
        });

        expensesSnapshot.forEach((expenseDocument) => {
          nextSummary.expenseFund += numberOrZero(expenseDocument.data().earnedToday);
        });
        nextSummary.profit = nextSummary.income - nextSummary.salary - nextSummary.expenseFund;

        if (isCurrentRequest) setReport({
          startDate: range.startDate,
          endDate: range.endDate,
          summary: nextSummary,
          workers: getWorkerRows(earningsSnapshot.docs),
          error: "",
        });
      } catch (loadError) {
        console.error("Statistika ma’lumotlarini yuklashda xatolik:", loadError);
        if (isCurrentRequest) setReport({
          startDate: range.startDate,
          endDate: range.endDate,
          summary: emptySummary,
          workers: [],
          error: "Statistika ma’lumotlarini yuklab bo‘lmadi.",
        });
      }
    };

    loadSummary();
    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, range.endDate, range.isValid, range.startDate]);

  const reportMatchesRange = report?.startDate === range.startDate
    && report?.endDate === range.endDate;
  const summary = reportMatchesRange ? report.summary : emptySummary;
  const workers = reportMatchesRange ? report.workers : [];
  const loading = activeTab === "stats" && range.isValid && !reportMatchesRange;
  const error = !range.isValid
    ? "Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas."
    : reportMatchesRange ? report.error : "";

  return (
    <main className="stats-page">
      <header className="stats-page-header">
        <div className="stats-page-mark" aria-hidden="true">✿</div>
        <div>
          <p className="stats-page-eyebrow">SAKURA · HISOBOT</p>
          <h1>Statistika</h1>
          <p className="stats-page-subtitle">Daromad va kundalik ish natijalari</p>
        </div>
      </header>

      <div className="stats-page-tabs" role="tablist" aria-label="Statistika bo‘limlari">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "stats"}
          className={activeTab === "stats" ? "stats-page-tab active" : "stats-page-tab"}
          onClick={() => setActiveTab("stats")}
        >
          <span aria-hidden="true">▤</span> Ko‘rsatkichlar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "expense"}
          className={activeTab === "expense" ? "stats-page-tab active" : "stats-page-tab"}
          onClick={() => setActiveTab("expense")}
        >
          <span aria-hidden="true">◈</span> Chiqim fondi
        </button>
      </div>

      {activeTab === "stats" ? (
        <StatsTab
          summary={summary}
          workers={workers}
          loading={loading}
          error={error}
          period={period}
          setPeriod={setPeriod}
          range={range}
          today={today}
          customStart={customStart}
          customEnd={customEnd}
          setCustomStart={setCustomStart}
          setCustomEnd={setCustomEnd}
        />
      ) : (
        <ExpenseTab currentWorker={currentWorker} />
      )}
    </main>
  );
}
