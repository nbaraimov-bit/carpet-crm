import { formatStatsNumber } from "../statsUtils";
import "./StatsTab.css";

const periods = [
  { id: "today", label: "Bugun" },
  { id: "week", label: "Hafta" },
  { id: "month", label: "Oy" },
  { id: "custom", label: "Sana" },
];

function SummaryCard({ icon, title, value, suffix, tone }) {
  return (
    <article className={`stats-summary-card ${tone}`}>
      <span className="stats-summary-icon" aria-hidden="true">{icon}</span>
      <span className="stats-summary-title">{title}</span>
      <strong className="stats-summary-value">{value}</strong>
      <span className="stats-summary-suffix">{suffix}</span>
    </article>
  );
}

function formatDate(dateId) {
  if (!dateId) return "";
  const date = new Date(`${dateId}T06:00:00.000Z`);
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Tashkent",
  }).format(date);
}

export default function StatsTab({
  summary,
  workers,
  loading,
  error,
  period,
  setPeriod,
  range,
  today,
  customStart,
  customEnd,
  setCustomStart,
  setCustomEnd,
}) {
  const dateLabel = range.startDate === range.endDate
    ? formatDate(range.startDate)
    : `${formatDate(range.startDate)} — ${formatDate(range.endDate)}`;

  return (
    <section className="stats-dashboard">
      <div className="stats-dashboard-heading">
        <div>
          <h2>{period === "today" ? "Bugungi ko‘rsatkichlar" : "Davr ko‘rsatkichlari"}</h2>
          <p>{period === "month" ? "Shu oy" : dateLabel}</p>
        </div>
        <span className="stats-orders-count">{loading ? "…" : `${summary.orderCount} buyurtma`}</span>
      </div>

      <div className="stats-period-picker" role="group" aria-label="Hisobot davri">
        {periods.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={period === item.id}
            className={period === item.id ? "stats-period-button active" : "stats-period-button"}
            onClick={() => setPeriod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {period === "custom" && (
        <div className="stats-custom-range">
          <label>
            <span>Boshlanish sanasi</span>
            <input
              type="date"
              value={customStart}
              max={customEnd || today}
              onChange={(event) => setCustomStart(event.target.value)}
            />
          </label>
          <span className="stats-range-separator" aria-hidden="true">→</span>
          <label>
            <span>Tugash sanasi</span>
            <input
              type="date"
              value={customEnd}
              min={customStart}
              max={today}
              onChange={(event) => setCustomEnd(event.target.value)}
            />
          </label>
        </div>
      )}

      {error && <div className="stats-message error" role="alert">{error}</div>}

      <div className="stats-summary-grid" aria-busy={loading}>
        <SummaryCard icon="↗" title="Jami tushum" value={loading ? "—" : formatStatsNumber(summary.income)} suffix="so‘m" tone="income" />
        <SummaryCard icon="♙" title="Jami ish haqi" value={loading ? "—" : formatStatsNumber(summary.salary)} suffix="so‘m" tone="salary" />
        <SummaryCard icon="◈" title="Chiqim fondi" value={loading ? "—" : formatStatsNumber(summary.expenseFund)} suffix="so‘m" tone="fund" />
        <SummaryCard icon="✦" title="Sof foyda" value={loading ? "—" : formatStatsNumber(summary.profit)} suffix="so‘m" tone="profit" />
      </div>

      <section className="stats-products-section">
        <div className="stats-section-heading">
          <div>
            <h3>Mahsulotlar</h3>
            <p>Tanlangan davr bo‘yicha jami</p>
          </div>
          <span aria-hidden="true">✿</span>
        </div>
        <div className="stats-product-grid">
          <article className="stats-product-card carpet">
            <span className="stats-product-icon" aria-hidden="true">▧</span>
            <span className="stats-product-title">Gilam</span>
            <strong>{loading ? "—" : formatStatsNumber(summary.products.carpetKvm, 2)}</strong>
            <small>kv.m</small>
          </article>
          <article className="stats-product-card blanket">
            <span className="stats-product-icon" aria-hidden="true">▤</span>
            <span className="stats-product-title">Adyol</span>
            <strong>{loading ? "—" : formatStatsNumber(summary.products.blankets)}</strong>
            <small>dona</small>
          </article>
          <article className="stats-product-card yakandoz">
            <span className="stats-product-icon" aria-hidden="true">◇</span>
            <span className="stats-product-title">Yakandoz</span>
            <strong>{loading ? "—" : formatStatsNumber(summary.products.yakandoz)}</strong>
            <small>dona</small>
          </article>
        </div>
      </section>

      <section className="stats-workers-card">
        <div className="stats-section-heading">
          <div>
            <h3>{period === "today" ? "Bugungi ishchilar" : "Davr ishchilari"}</h3>
            <p>Hisoblangan ish haqi bo‘yicha</p>
          </div>
          <span className="stats-worker-count">{loading ? "…" : `${workers.length} xodim`}</span>
        </div>

        {loading ? (
          <div className="stats-message">Ma’lumot yuklanmoqda…</div>
        ) : workers.length === 0 ? (
          <div className="stats-message">Tanlangan davrda ish haqi hisoblanmagan.</div>
        ) : (
          <div className="stats-worker-list">
            {workers.map((worker) => (
              <div className="stats-worker-row" key={worker.phone}>
                <span className="stats-worker-avatar" aria-hidden="true">{(worker.name || "X").trim().charAt(0).toUpperCase()}</span>
                <span className="stats-worker-name">{worker.name}</span>
                <strong>{formatStatsNumber(worker.totalSalary)} so‘m</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
