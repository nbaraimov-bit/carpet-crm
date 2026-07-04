import { db } from "../../firebase"
import { useState, useEffect } from "react"
import "./teams.css"
import PendingTeamCard from "./PendingTeamCard";
import CreateTeamModal from "./CreateTeamModal";
import ActiveTeams from "./ActiveTeams/ActiveTeams";

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

export default function TeamsPanel({

  teams,
  setTeams,
  role,
  currentWorker,
  workers,
  setPage,
  allowedRoles

}) {

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [pendingTeams, setPendingTeams] = useState([])
    
  const myTeams = teams.filter((team) => {
    return team.members?.[currentWorker.phone];
  });
  const hasTeam = myTeams.length > 0;

  const isAdmin = allowedRoles.includes("admin") || allowedRoles.includes("ega")
  const isWorker = allowedRoles.includes("worker")

  useEffect(() => {

    let q 

    if (isAdmin) {

      q = collection(db, "pendingTeams")

    } else {

      q = query(
        collection(db, "pendingTeams"),
        where("createdBy", "==", currentWorker.phone)
      )

    }

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPendingTeams(list)

    })

    return () => unsubscribe()

  }, [currentWorker.phone])

  const pendingCards = pendingTeams
  .filter(team => isWorker || team.status !== "rejected")
  .map(team => (
    <PendingTeamCard
      key={team.id}
      team={team}
      showActions={isAdmin}
      currentWorker={currentWorker}
    />
  ));

  const activeCards = myTeams.map((team) => (

    <ActiveTeams
      key={team.teamId}
      team={team}
      currentWorker={currentWorker}
      isAdmin={isAdmin}
    />

  ));

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
          <CreateTeamModal

            showCreateTeam={showCreateTeam}
            setShowCreateTeam={setShowCreateTeam}
            myTeams={myTeams}
            currentWorker={currentWorker}
  
          />
        )}

        <p>Jamoalarim</p>

        {pendingCards}
        {activeCards}

      </>)}

      {isAdmin && (<>
        <h3>Barcha jamoalar</h3>

        <p>So'rovlar</p>

        {pendingCards}

        <p>Faol jamoalar ro'yxati</p>

        {activeCards}

      </>)}

    </div>
  )
}