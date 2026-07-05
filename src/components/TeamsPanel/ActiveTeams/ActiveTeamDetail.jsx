import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";

export default function ActiveTeamDetail({

    team,
    currentWorker,
    isAdmin,
    closeTeam,

}) {

  const workingCount = Object.values(team.members || {})
  .filter(member => member.working)
  .length;
  const teamType = teamTypeMap[team.type];

  return (

      <div>

        <button onClick={closeTeam}>
          ⬅️
        </button>

        <div className="team-detail-summary">

          <div className="team-detail-header">

            <div>
              <h2>{team.teamName}</h2>
              <p>{teamType?.icon} {teamType?.title}</p>
            </div>

            <div className="team-online">
              🟢 {workingCount} kishi faol
            </div>

          </div>

          <div className="team-stats-grid">

          <div className="team-stat-box">
            <h4>🧼 Gilam</h4>
            <p>0 kv • 0 so'm</p>
          </div>

          <div className="team-stat-box">
            <h4>🛏 Adyol</h4>
            <p>0 ta • 0 so'm</p>
          </div>

          <div className="team-stat-box">
            <h4>🧵 Yakandoz</h4>
            <p>0 ta • 0 so'm</p>
          </div>

          <div className="team-stat-box">
            <h4>🪟 Parda</h4>
            <p>0 m • 0 so'm</p>
          </div>

        </div>

        <div className="team-total-card">

          💰 Jami: <b>0 so'm</b>

        </div>

      </div>

    </div>

  )

}