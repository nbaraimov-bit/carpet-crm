import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamInfoCard({
    workingCount,
    teamType,
    team, 
    todayTeam,
}) {

  const data = todayTeam || {}

const services = [
  {
    key: "carpet",
    title: "🧼 Gilam",
    amount: "carpetKvm",
    salary: "carpetSalary",
    unit: "kv",
  },
  {
    key: "blanket",
    title: "🛏 Adyol",
    amount: "blanketCount",
    salary: "blanketSalary",
    unit: "ta",
  },
  {
    key: "yakandoz",
    title: "🧵 Yakandoz",
    amount: "yakandozCount",
    salary: "yakandozSalary",
    unit: "ta",
  },
  {
    key: "curtain",
    title: "🪟 Parda",
    amount: "curtainMeter",
    salary: "curtainSalary",
    unit: "m",
  },
]

  const field = (stage, name) => stage +
  name.charAt(0).toUpperCase() +
  name.slice(1)

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

          {services.map((service) => (

            <div
              className="team-stat-box"
              key={service.key}
            >

              <h4>{service.title}</h4>  

              <p>

                {data[service.amount] || 0}
                {" "}
                {service.unit}
                {" • "}
                {Number(data[service.salary] || 0).toLocaleString()}
                {" so'm"}

              </p>

            </div>

          ))}

        </div>

        <div className="team-total-card">

          💰 Jami: <b>{Number(data.salary || 0).toLocaleString()}{" so'm"}</b>

        </div>
    
      </div>

    </div>

    )}

  </>)

}