export default function TeamLeaderPanel({
  team,
  currentWorker,
}) {

  return (
    <>

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
    </>
  );

}