import TeamLeaderPanel from "./TeamLeaderPanel";
import teamTypes, { teamTypeMap } from "../teamTypes";
import { useState, useEffect } from "react"
import "./ActiveTeams.css"

export default function ActiveTeams({
  team,
  currentWorker,
  isAdmin,
  openTeam
}) {

  const teamMember = team.members?.[currentWorker.phone];
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";
  const teamType = teamTypeMap[team.type];
  const memberCount = Object.keys(team.members || {}).length;

  return (<>

      <div className="active-team-card"
       onClick={() => openTeam(team)}
      > 

        <div className="active-team-accent"></div>

        <div className="team-status active">
            🟢 Faol
        </div>

        <div className="active-team-header">
          {team.teamName}
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

      </div>

  </>)
  
}