import TeamAdminPanel from "./TeamAdminPanel";
import TeamLeaderPanel from "./TeamLeaderPanel";
import TeamMemberPanel from "./TeamMemberPanel";
import teamTypes, { teamTypeMap } from "../teamTypes";
import "./ActiveTeams.css"

export default function ActiveTeams({
  team,
  currentWorker,
  isAdmin,
}) {

  const teamMember = team.members?.[currentWorker.phone];
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";
  const teamType = teamTypeMap[team.type];
  const memberCount = Object.keys(team.members || {}).length;

  return (

      <div className="active-team-card">

        <div className="active-team-accent"></div>

        <div className="active-team-header">

          <div className="team-status active">
            🟢 Faol
          </div>

           <h3>{team.teamName}</h3>

        </div>

        <div className="active-team-type">
          {teamType?.icon} {teamType?.title}
        </div>

        <div className="active-team-info">
          👥 {memberCount} ta a'zo
        </div>

        <div className="active-team-info">
          👑 {team.leader}
        </div>

        {isAdmin && <TeamAdminPanel />}

        {isLeader && <TeamLeaderPanel />}

        {isMember && <TeamMemberPanel />}

      </div>

     

  )
  
}