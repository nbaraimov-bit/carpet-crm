import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useState } from "react"

export default function TeamsPanel({
  teams,
  setTeams,
  role,
  currentWorker,
  workers,
  setPage,
}) {

  const [showCreateTeam, setShowCreateTeam] = useState(false)
    
  const myTeams = teams.filter((team) => {
    return team.members?.[currentWorker.phone];
  });
  const hasTeam = myTeams.length > 0;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setPage("home")}>
        ⏪
      </button>

      <h2>Jamoalar</h2>

      <p>Bu yerda barcha jamoalar chiqadi.</p>

      {!hasTeam && (  
        <div
          style={{
            border: "1px solid #555",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>Siz hali hech qaysi jamoaga qo'shilmagansiz</h3>

          <button
            onClick={() => setShowCreateTeam(true)}
          >
            ➕ Jamoa yaratish
          </button>

          <button style={{ marginLeft: 10 }}>
            📨 Jamoaga qo'shilish
          </button>
        </div>
      )}

      {showCreateTeam && (
        <div>
          Modal shu yerda bo'ladi
        </div>
      )}

      {myTeams.map((team) => (

        <div
          key={team.teamId}
          style={{
            border: "1px solid #555",
            borderRadius: 10,
            padding: 10,
            marginTop: 10,
          }}
        >

          <p>
  {team.members[currentWorker.phone].rank === "leader"
    ? "👑 Leader"
    : "👤 Member"}
</p>
          <b>{team.teamName}</b>
          <p>{team.type}</p>
          <p>{team.leader}</p>
          
        </div>
      ))}
    </div>
  )
}