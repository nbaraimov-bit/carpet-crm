import TeamAdminPanel from "./TeamAdminPanel";
import TeamLeaderPanel from "./TeamLeaderPanel";
import TeamMemberPanel from "./TeamMemberPanel";
import teamTypes, { teamTypeMap } from "../teamTypes";

export default function ActiveTeams({
  team,
  currentWorker,
  isAdmin,
}) {

  const teamMember = team.members?.[currentWorker.phone];
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";
  const teamType = teamTypeMap[team.type];

  return (
    
    <div>

      <div className="active-team-card">

    <div className="active-team-accent"></div>

    <div className="active-team-header">
        <h3>{team.teamName}</h3>
    </div>

    <div className="active-team-type">
        {teamType?.icon} {teamType?.title}
    </div>

    <div className="active-team-info">
        👥 {Object.keys(team.members || {}).length} ta a'zo
    </div>

    <div className="active-team-info">
        👑 {team.leaderName}
    </div>

    {isAdmin && <TeamAdminPanel />}

    {isLeader && <TeamLeaderPanel />}

    {isMember && <TeamMemberPanel />}

</div>

      {isAdmin && <TeamAdminPanel />}

      {isLeader && <TeamLeaderPanel />}

      {isMember && <TeamMemberPanel />}
    </div>

  )
  
}