import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
export default function TeamMemberCard({
  team,
  member,
  members,
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

  const getDriverShare = (total, rank) => {

    const activeLeader = members.some((m) => m.rank === "leader" && m.working);

    const activeMember = members.some((m) => m.rank === "member" && m.working);

    // Ikkalasi ham faol
    if (activeLeader && activeMember) {
      return rank === "leader"
        ? Math.round(total * 0.55)
        : Math.round(total * 0.45);
    }

    // Faqat leader faol
    if (activeLeader) {
      return rank === "leader" ? total : 0;
    }

    // Faqat member faol
    if (activeMember) {
      return rank === "member" ? total : 0;
    }

    return 0;
  };

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

      const pickup = getDriverShare(
        pickupTotal,
        member.rank
      );

      const delivery = getDriverShare(
        deliveryTotal,
        member.rank
      );

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