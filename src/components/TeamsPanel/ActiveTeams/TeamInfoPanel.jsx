import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamInfoPanel({
    workingCount,
    teamType,
    team
}) {

  return (<>

    {team.type === "washer" &&(

    <div>

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

    )}

  </>)

}