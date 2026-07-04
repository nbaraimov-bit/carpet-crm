import TeamAdminPanel from "./panels/TeamAdminPanel";
import TeamLeaderPanel from "./panels/TeamLeaderPanel";
import TeamMemberPanel from "./panels/TeamMemberPanel";

export default function ActiveTeams({
  team,
  currentWorker,
  isAdmin,
}) {

  const teamMember = team.members?.[currentWorker.phone];
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";

  return (

    <div className="active-team-card">

        <div className="active-team-accent"></div>

            <div className="active-team-header">

                🟢 {team.teamName}

            </div>

      {isAdmin && <TeamAdminPanel />}

      {isLeader && <TeamLeaderPanel />}

      {isMember && <TeamMemberPanel />}

    </div>

  )
  
}