import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useState } from "react"
import "./styles/teams.css"

export default function TeamsPanel({
  teams,
  setTeams,
  role,
  currentWorker,
  workers,
  setPage,
}) {

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [selectedType, setSelectedType] = useState("")
    
  const myTeams = teams.filter((team) => {
    return team.members?.[currentWorker.phone];
  });
  const hasTeam = myTeams.length > 0;

  const teamTypes = [
  {
    id: "washer",
    title: "Gilam yuvish",
    icon: "🧼",
  },
  {
    id: "curtain",
    title: "Parda yuvish",
    icon: "🪟",
  },
  {
    id: "driver",
    title: "Yetkazib berish",
    icon: "🚚",
  },
  {
    id: "tayyorlovchi",
    title: "Tayyorlovchi",
    icon: "📦",
  },
]

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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: 320, 
              background: "#111827",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <h2>👥 Jamoa yaratish</h2>

            <p>Jamoa nomi</p>

            <input
              value={teamName}
              onChange={(e)=>setTeamName(e.target.value)}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginTop: 20,
              }}
            >
              {teamTypes.map((type) => (
                <div
  key={type.id}
  onClick={() => setSelectedType(type.id)}
  className={
    selectedType === type.id
      ? "team-type-card active"
      : "team-type-card"
  }
>
  <div className="team-type-icon">
    {type.icon}
  </div>

  <div className="team-type-title">
    {type.title}
  </div>
</div>
              ))}
            </div>

            <button onClick={() => setShowCreateTeam(false)}>
              Bekor qilish
            </button>
          </div>
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