import { db } from "../../../firebase"
import { useState, useEffect } from "react"
import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
import TeamLeaderPanel from "./TeamLeaderPanel";
import TeamInfoPanel from "./TeamInfoPanel";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  deleteDoc
} from "firebase/firestore"

export default function ActiveTeamDetail({

    team,
    currentWorker,
    closeTeam,
    allowedRoles,
    role,

}) {

  const workingCount = Object.values(team.members || {})
  .filter(member => member.working)
  .length;
  const teamType = teamTypeMap[team.type];
  const teamMember = team.members?.[currentWorker.phone];
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";
  const isAdmin = allowedRoles.includes("admin") || allowedRoles.includes("ega");

  return (

    <div>

      <div>

        <button onClick={closeTeam}>
          ⬅️
        </button>

        <TeamInfoPanel
          team={team}
          teamType={teamType}
          workingCount={workingCount}
        />

      </div>

      {isLeader && <TeamLeaderPanel
        
        mode="joinRequests"
        team={team}
        currentWorker={currentWorker}


      />}

      {isLeader ? (
        <TeamLeaderPanel
          mode={"memberPrices"}
          team={team}
          currentWorker={currentWorker}
        />
      ) : (
        <>
          <div className="member-card">
  
            <div className="member-accent"></div>

            <div className="member-header">

              <div>

                <div className="member-name">
                  👤 namuna
                </div>

                <div className="member-rank">

                  {/*{member.rank === "leader"
                    ? "👑 Leader"
                    : "👤 Member"
                  }*/}

                </div>

              </div>

              {/*<div className={`member-status ${member.working ? "true" : "false"}`}>

                {member.working ? "🟢 Faol" : "⚪️ Nofaol"}

              </div>*/}

            </div>

            <div className="member-prices">

              <div>🧼 Gilam</div>
              <div>0 so'm</div>

              <div>🛏️ Adyol</div>
              <div>0 so'm</div>

              <div>🧵 Yakandoz</div>
              <div>0 so'm</div>

              <div>🪟 Parda</div>
              <div>0 so'm</div>

            </div>

            <div className="member-salary"> 

              💰 Bugungi ish haqi

              <b>0 so'm</b>

            </div>

          </div>
        </>
      )}

      {(isLeader || isAdmin) && (

        <div className="delete-team-card">

          <div className="delete-team-title">
            🗑️ Jamoani o'chirish
          </div>

          <div className="delete-team-description">
            Jamoani va unga tegishli barcha ma'lumotlarni o'chiradi.
          </div>

        </div>

      )}

    </div>

  )

}