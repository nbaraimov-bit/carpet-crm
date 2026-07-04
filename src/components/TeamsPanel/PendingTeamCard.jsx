import { teamTypeMap } from "./teamTypes";

export default function PendingTeamCard({
  team,
  showActions,
  approveTeam,
  rejectTeam,
}) {

  const isRejected = team.status === "rejected";

  return (

    <div className="pending-team-card">

      <div className={`team-accent ${isRejected ? "rejected" : ""}`}></div>

      <div className="team-header">

        <div className={`team-status ${isRejected ? "rejected" : "pending"}`}>
          {isRejected ? "🔴 Rad etilgan" : "🟡 Tasdiqlanishi kutilmoqda"}
        </div>

      </div>

      <div className="team-title">
        👥 {team.teamName}
      </div>

      <div className="team-leader-info">

        <div className="team-leader">
          👤 {team.leaderName}
        </div>

        <div className="team-phone">
          📞 {team.createdBy}
        </div>

      </div>

      <div className="team-type">
        {teamTypeMap[team.type]?.icon}{" "}
        {teamTypeMap[team.type]?.title}
      </div>

      {showActions ? (

        <div className="team-footer">

          <div className="team-actions">

            <button
              className="reject-team-btn"
              onClick={() => rejectTeam(team)}
            >
              Rad etish
            </button>

            <button
              className="approve-team-btn"
              onClick={() => approveTeam(team)}
            >
              Tasdiqlash
            </button>

          </div>

        </div>

      ) : (

        <div className="team-footer">
          {team.status === "pending" ? (
            <>
              <div className="team-note">
                {isRejected
                  ? "Jamoangiz rad etildi. Uni o'chirib yangi jamoa yaratishingiz mumkin."
                  : "Admin tasdiqlaganidan so'ng jamoangiz avtomatik faollashadi."
                }
              </div>

              <button
                className="delete-team-btn"
                onClick={() => rejectTeam(team)}
              >
                O'chirish
              </button>
            </>
          ) : (
            <button
              className="delete-team-btn"
              onClick={() => rejectTeam(team)}
            >
              O'chirish
            </button>
          )}
        </div>

      )}

    </div>

  )

}