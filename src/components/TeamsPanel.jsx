import { db } from "../firebase"
import { useState } from "react"
import "../styles/teams.css"
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"

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
  const [loading, setLoading] = useState(false)

  const nameLength = teamName.trim().length
  const isNameValid = nameLength >= 5 && nameLength <= 20
    
  const myTeams = teams.filter((team) => {
    return team.members?.[currentWorker.phone];
  });
  const hasTeam = myTeams.length > 0;
  const joinedTypes = myTeams.map((team) => team.type)

  const isAdmin = role === "admin" || role === "ega"
  const isWorker = role === "worker"

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

  function handleCloseCreateModal() {
    setTeamName("")
    setSelectedType("")
    setShowCreateTeam(false)
  }

  async function handleCreateTeam() {

    console.log({
      teamName,
      selectedType,
    })

    const pendingTeam = {

      teamName: teamName.trim(),
      type: selectedType,
      createdBy: currentWorker.phone,
      leaderName: currentWorker.name,
      status: "pending",
      createdAt: serverTimestamp(),

    }

    console.log(pendingTeam)

    try {

      setLoading(true)

      await addDoc(
        collection(db, "pendingTeams"),
        pendingTeam
      )

      handleCloseCreateModal()

      console.log("Team yuborildi")
  
    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setPage("home")}>
        ⏪
      </button>

      {isWorker && (<>

        <h2>Jamoa boshqaruv paneli</h2>
       
        <div
          style={{
            border: "1px solid #555",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          
          {!hasTeam && ( 
            <h3>Siz hali hech qaysi jamoaga qo'shilmagansiz</h3>
          )}

          <button
            onClick={() => setShowCreateTeam(true)}
          >
            ➕ Jamoa yaratish
          </button>  

          <button style={{ marginLeft: 10 }}>
            📨 Jamoaga qo'shilish
          </button>
        </div>

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
                width: "90%",
                maxWidth: 380,  
                background: "#111827",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <h2>👥 Jamoa yaratish</h2>

              <p>Jamoa nomi</p>

              <input
                className={
                  nameLength === 0
                  ? "team-name-input"
                  : isNameValid
                  ? "team-name-input valid"
                  : "team-name-input invalid"
                }
                placeholder="Masalan: fatality"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />

              {nameLength > 0 && nameLength < 5 && (
                <p className="input-error">
                  Kamida 5 ta belgi kiriting
                </p>
              )}

              {nameLength > 20 && (
                <p className="input-error">
                  Eng ko'pi 20 ta belgi bo'lishi mumkin
                </p> 
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {teamTypes.map((type) => { 

                  const disabled = joinedTypes.includes(type.id)  

                  return(

                    <div
                      key={type.id}
                      onClick={() => {
                        if(disabled) return
                        setSelectedType(type.id)
                      }}

                      className={
                        disabled ? "team-type-card disabled"
                        :selectedType === type.id
                        ? "team-type-card active"
                        : "team-type-card"
                      }
                    >
                      <div className="team-content">
                        <div className="team-type-icon">
                          {type.icon}
                        </div>    

                        <div className="team-type-title">
                          {type.title}
                        </div>
                      </div> 
 
                      {disabled && (
                        <div className="team-stamp">
                          A'ZO
                        </div>
                      )}

                    </div>

                  )

                })}
              </div>

              <div className="create-team-buttons">

                <button
                  className="cancel-button"
                  onClick={handleCloseCreateModal}
                >
                  Bekor
                </button>

                <button
                  className="create-button"
                  disabled={
                    loading ||
                    teamName.trim().length < 5 ||
                    teamName.trim().length > 20 ||
                    !selectedType
                  }
                  onClick={handleCreateTeam}
                >
                  {loading ? "Yaratilmoqda..." : "Yaratish"}
                </button>

              </div>

            </div>
          </div>
        )}

        <p>Jamoalarim</p>

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

            <p>{team.members[currentWorker.phone].rank === "leader" ? "👑 Leader" : "👤 Member"}</p>
            <b>{team.teamName}</b>
            <p>{team.type}</p>
            <p>{team.leader}</p>
          
          </div>
        ))}
      </>)}

      {isAdmin && (<>
        <h3>Barcha jamoalar</h3>

        <p>Pending va Active jamoalar shu yerda chiqadi.</p>
      </>)}

    </div>
  )
}