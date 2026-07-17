import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamMemberCard({
  team,
  member,
  currentWorker,
  earnings,
  toggleWorking,
  removeMember,
  isLeader,
  driverPrices,
  packingPrices,
  workingCount,
}) {

  const services = teamTypeMap[team.type]?.services || [];
  const salaryField = `${team.type}Salary`;

  const getServicePrice = (service) => {

  if (team.type === "washer") {
    return `${Number(member?.[service.key] || 0).toLocaleString()} so'm`;
  }

  if (team.type === "packing") {

    const total = Number(packingPrices?.[service.key] || 0);

    const price =
      workingCount > 0
        ? Math.round(total / workingCount)
        : 0;

    return `${price.toLocaleString()} so'm`;
  }

  if (team.type === "driver") {

    const pickupTotal =
      Number(driverPrices?.["pickup" + service.key.charAt(0).toUpperCase() + service.key.slice(1)] || 0);

    const deliveryTotal =
      Number(driverPrices?.["delivery" + service.key.charAt(0).toUpperCase() + service.key.slice(1)] || 0);

    const pickup =
      member.rank === "leader"
        ? Math.round(pickupTotal * 0.55)
        : Math.round(pickupTotal * 0.45);

    const delivery =
      member.rank === "leader"
        ? Math.round(deliveryTotal * 0.55)
        : Math.round(deliveryTotal * 0.45);

    return `📥${pickup} | 📤${delivery}`;
  }

  return "";
};

  return(<>

      <div>
  
        <div className="member-card">
  
          <div className="member-accent"></div>

          <div className="member-header">

            <div>

              <div className="member-name">
                👤 {member.name}
              </div>

              <div className="member-rank">
                {member.rank === "leader"
                  ? "👑 Leader"
                  : "👤 Member"
                }
              </div>

            </div>

            <div className={`member-status ${member.working ? "active" : ""}`}>
              {member.working ? "🟢 Faol" : "⚪️ Nofaol"}
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
                  {getServicePrice(service)}
                </div>

              </div>

            ))}

          </div>

          <div className="member-salary"> 

            <div className="member-salary-title">
              💰 Bugungi ish haqi
            </div>

            <div className="member-salary-value">
              <b>{(earnings?.[member.phone]?.[salaryField] ?? 0).toLocaleString()} so'm</b>
            </div>

          </div>

        </div>

      </div>

    {isLeader && (
      <div className="member-actions">

        <button 
          className="remove-member-btn"
          onClick={() => removeMember(member)}
        >
          Chiqarib yuborish
        </button>

        <button
          className={`working-btn ${member.working ? "active" : "inactive"}`}
          onClick={() => toggleWorking(member)}
        >
          {member.working ? "🟢 Faol" : "⚪️ Nofaol"}
        </button>

      </div>
    )}
  
  </>)

}