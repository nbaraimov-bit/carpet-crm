import { db } from "../../firebase"
import { useState, useEffect } from "react"
import { teamTypeMap } from "./teamTypes"

import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"

export default function JoinTeamModal({

  setShowJoinTeam,
  currentWorker,

}) {

  const [teams, setTeams] = useState([])

  function handleCloseJoinModal() {

    setShowJoinTeam(false)

  }

  async function handleJoinTeam(team) {

  try {

    await addDoc(

      collection(db, "joinRequests"),

      {

        sender: currentWorker.phone,
        name: currentWorker.name,
        teamId: team.id,
        teamName: team.teamName,
        type: team.type,
        status: "pending",
        createdAt: serverTimestamp(),

      }

    )

    setShowJoinTeam(false)

  } catch (err) {

    console.error(err)

  }

}

useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "teams"),

      (snapshot) => {

        const list = snapshot.docs.map(doc => ({

          id: doc.id,
          ...doc.data(),

        }))

        setTeams(list)

      }

    )

    return () => unsubscribe()

  }, [])

  return (

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

        <h2>👥 Jamoaga qo'shilish</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 20,
            marginBottom: 20,
          }}
        >

          {teams.map((team) => {

            const memberCount = Object.keys(team.members || {}).length
            const teamType = teamTypeMap[team.type]

            return (

              <div
                key={team.id}
                className="join-team-card"
                onClick={() => handleJoinTeam(team)}
              >

                <h3>{team.teamName}</h3> 
                <p>{teamType?.icon} {teamType?.title}</p>
                <p>👥 {memberCount} ta a'zo</p>

              </div>

            )

          })}

        </div>

        <button
          onClick={handleCloseJoinModal}
        >
          Bekor
        </button>

      </div>

    </div>

  )

}