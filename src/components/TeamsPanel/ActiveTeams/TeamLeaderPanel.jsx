import "./ActiveTeams.css"
export default function TeamLeaderPanel({
  team,
  currentWorker,
  mode,
}) {

  return (
    <>

      {mode === "joinRequests" && (

        <div className="join-request-card">

          <div className="join-request-accent"></div>

          <div className="join-request-header">

            <div className="join-request-title">
              📩 Qo'shilish so'rovi
            </div>

            <div className="join-request-status">
              Kutilmoqda
            </div>

          </div>

          <div className="join-request-worker">
            👤 Ali Valiyev
          </div>

          <div className="join-request-role">
            🧼 Gilam yuvuvchi
          </div>

          <div className="join-request-buttons">

            <button className="reject-button">
              ❌ Rad etish
            </button>

            <button className="approve-button">
              ✅ Tasdiqlash
            </button>

          </div>

        </div>

      )}

      {/* ===== Leader uchun MemberCardlar ===== */}
      {mode === "memberPrices" && (

        <div className="member-card">
  
          <div className="member-accent"></div>

          <div className="member-header">

            <div>

              <div className="member-name">
                👤 Ali
              </div>

              <div className="member-rank">
                👤 Member
              </div>

            </div>

            <div className="member-status active">
              🟢 Faol
            </div>

          </div>

          <div className="member-prices">

            <div>🧼 Gilam</div>
            <div>
              <input
                className="member-price-input"
                placeholder="0"
              />
            </div>

            <div>🛏️ Adyol</div>
            <div>
              <input
                className="member-price-input"
                placeholder="0"
              />
            </div>

            <div>🧵 Yakandoz</div>
            <div>
              <input
                className="member-price-input"
                placeholder="0"
              />
            </div>

            <div>🪟 Parda</div>
            <div>
              <input
                className="member-price-input"
                placeholder="0"
              />
            </div>

          </div>

          <div className="member-salary">

            💰 Bugungi ish haqi

            <b>0 so'm</b>

          </div>

          <div className="member-actions">

            <button className="remove-member-btn">
              🚪 Chiqarib yuborish
            </button>

            <button className="working-btn">
              ⚪️ Nofaol
            </button>

          </div>

        </div>

      )}

    </>
  );

  return null
}