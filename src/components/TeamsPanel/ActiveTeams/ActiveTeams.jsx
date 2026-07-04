import TeamAdminPanel from "./TeamAdminPanel";
import TeamLeaderPanel from "./TeamLeaderPanel";
import TeamMemberPanel from "./TeamMemberPanel";
import { teamTypeMap } from "../teamTypes";

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

    <div className="active-team-card">

      <div className="active-team-accent"></div>

      <div className="active-team-header">
                
        <div className="active-team-type">
          {teamType?.icon} {teamType?.title}
        </div>
        
        {team.teamName}

      </div>

      {isAdmin && <TeamAdminPanel />}

      {isLeader && <TeamLeaderPanel />}

      {isMember && <TeamMemberPanel />}

    </div>

  )
  
}