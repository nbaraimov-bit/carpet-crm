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

  const renderStage = (title = "", prefix = "") => {

  const totalField = prefix ? prefix + "Salary" : "salary";

  return (

    <>

      {title && <h3>{title}</h3>}

      <div className="team-stats-grid">

        {services.map((service) => {

          const amountField =
            prefix
              ? prefix +
                service.amount.charAt(0).toUpperCase() +
                service.amount.slice(1)
              : service.amount;

          const salaryField =
            prefix
              ? prefix +
                service.salary.charAt(0).toUpperCase() +
                service.salary.slice(1)
              : service.salary;

          return (

            <div
              className="team-stat-box"
              key={service.key}
            >

              <h4>{service.title}</h4>

              <p>

                {data[amountField] || 0}
                {" "}
                {service.unit}
                {" • "}
                {data[salaryField] || 0}
                {" so'm"}

              </p>

            </div>

          );

        })}

      </div>

      <div className="team-total-card">

        💰 Jami:

        <b>

          {data[totalField] || 0}

          {" so'm"}

        </b>

      </div>

    </>

  );

};


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

          {team.type === "driver" ? (
            <>
              {renderStage("🚚 Olib kelish", "pickup")}
              {renderStage("📦 Yetkazish", "delivery")}
            </>
          ) : (
            renderStage()
          )}

        </div>

      </div>

    )}

  </>)

}