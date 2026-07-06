import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamMemberCard({
  team,
  member,
  currentWorker,
}) {

  const services = teamTypeMap[team.type]?.services || [];

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

                {member.rank === "leader"
                  ? "👑 Leader"
                  : "👤 Member"
                }

              </div>

            </div>

            <div className="member-status">

              🟢 Faol

            </div>

          </div>

          <div className="member-price-grid">

  {services.map((service) => (

    <div
      key={service.key}
      className="member-price-box"
    >

      <div className="member-price-title">
        {service.icon} {service.title}
      </div>

      <div className="member-price-value">
        {(member?.[service.key] ?? 0).toLocaleString()} so'm
      </div>

    </div>

  ))}

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