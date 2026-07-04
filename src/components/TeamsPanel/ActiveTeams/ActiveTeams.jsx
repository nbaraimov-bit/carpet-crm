import TeamAdminPanel from "./panels/TeamAdminPanel";
import TeamLeaderPanel from "./panels/TeamLeaderPanel";
import TeamWorkerPanel from "./panels/TeamWorkerPanel";

export default function ActiveTeams({
  team,
  currentWorker,
  isAdmin,
}) {

  const isLeader =
  team.members[currentWorker.phone]?.rank === "leader";

  return (

    <div className="active-team-card">

        <div className="active-team-accent"></div>

            <div className="active-team-header">

                🟢 {team.teamName}

            </div>

      {isAdmin && <TeamAdminPanel />}

      {isLeader && <TeamLeaderPanel />}

      {isWorker && <TeamWorkerPanel />}

    </div>

  )
  
}