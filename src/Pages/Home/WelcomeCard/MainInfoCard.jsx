import "./MainInfoCard.css";

export default function MainInfoCard() {
  return (
    <section className="main-info-card">

      {/* Katta umumiy karta */}
      <div className="main-info-header">
        <div>
          <h3>📊 Buyurtmalar holati</h3>
          <p>Bugungi ko‘rsatkichlar</p>
        </div>

        <div className="main-info-total">
          <strong>32</strong>
          <span>buyurtma</span>
        </div>
      </div>

      {/* 4 ta holat */}
      <div className="main-info-status">

        <div className="info-status-item">
          <div className="info-status-icon">🆕</div>
          <div className="info-status-title">Yangi</div>
          <strong>12</strong>
          <span>buyurtma</span>
          <small>18 🟣 · 6 🛏</small>
        </div>

        <div className="info-status-item">
          <div className="info-status-icon">📥</div>
          <div className="info-status-title">Olindi</div>
          <strong>8</strong>
          <span>buyurtma</span>
          <small>12 🟣 · 3 🛏</small>
        </div>

        <div className="info-status-item">
          <div className="info-status-icon">🧼</div>
          <div className="info-status-title">Yuvildi</div>
          <strong>5</strong>
          <span>buyurtma</span>
          <small>8 🟣 · 2 🛏</small>
        </div>

        <div className="info-status-item">
          <div className="info-status-icon">✅</div>
          <div className="info-status-title">Tayyor</div>
          <strong>7</strong>
          <span>buyurtma</span>
          <small>10 🟣 · 4 🛏</small>
        </div>

      </div>

    </section>
  );
}