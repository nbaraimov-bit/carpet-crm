import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamMemberCard({
  team,
}) {

  return(<>

    {team.type === "washer" &&(

      <div>
  
        <div className="member-card">
  
          <div className="member-accent"></div>

          <div className="member-header">

            <div>

              <div className="member-name">
                👤 namuna
              </div>

              <div className="member-rank">

                {/*{member.rank === "leader"
                  ? "👑 Leader"
                  : "👤 Member"
                }*/}

              </div>

            </div>

            {/*<div className={`member-status ${member.working ? "true" : "false"}`}>

              {member.working ? "🟢 Faol" : "⚪️ Nofaol"}

            </div>*/}

          </div>

          <div className="member-prices">

            <div>🧼 Gilam</div>
            <div>0 so'm</div>

            <div>🛏️ Adyol</div>
            <div>0 so'm</div>

            <div>🧵 Yakandoz</div>
            <div>0 so'm</div>

            <div>🪟 Parda</div>
            <div>0 so'm</div>

          </div>

          <div className="member-salary"> 

            💰 Bugungi ish haqi

            <b>0 so'm</b>

          </div>

        </div>

      </div>

    )}
  
  </>)

}