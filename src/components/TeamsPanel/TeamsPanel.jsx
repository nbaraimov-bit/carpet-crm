import { db } from "../../firebase"
import { useState, useEffect } from "react"
import "./teams.css"
import PendingTeamCard from "./PendingTeamCard";
import teamTypes, { teamTypeMap } from "./TeamTypes";
import CreateTeamModal from "./CreateTeamModal";

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
  const [teamName, setTeamName] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [loading, setLoading] = useState(false)
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

  function handleCloseCreateModal() {
    setTeamName("")
    setSelectedType("")
    setShowCreateTeam(false)
  }

  async function handleCreateTeam() {

    const pendingTeam = {

      teamName: teamName.trim(),
      type: selectedType,
      createdBy: currentWorker.phone,
      leaderName: currentWorker.name,
      status: "pending",
      createdAt: serverTimestamp(),

    }

    try {

      setLoading(true)

      await addDoc(
        collection(db, "pendingTeams"),
        pendingTeam
      )

      handleCloseCreateModal()
  
    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false) 

    }

  }

  const approveTeam = async (team) => {

    try{

        await addDoc(collection(db,"teams"),{

            teamName: team.teamName,

            teamType: team.type,

            leader: team.leaderName,

            createdBy: team.createdBy,

            createdAt: team.createdAt,

            approvedBy: currentWorker.phone,

            approvedAt: serverTimestamp(),

            status:"active",

            members:{

                [team.createdBy]:{

                    name: team.leaderName,

                    phone: team.createdBy,

                    rank:"leader",

                    carpet:0,

                    blanket:0,

                    yakandoz:0,

                    curtain:0,

                    working:true,

                }

            }

        })

      await deleteDoc(doc(db, "pendingTeams", team.id))

    }catch(err){

        console.log(err)

    }

  }

  const rejectTeam = async (team) => {

    try{

      await updateDoc(
        doc(db, "pendingTeams", team.id),
        {

          status: "rejected",

          rejectedBy: currentWorker.phone,

          rejectedAt: serverTimestamp(),

          rejectReason: "",

        }
      )

      console.log("Jamoa rad etildi")

    }catch(err){

        console.log(err)

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
          <CreateTeamModal

            showCreateTeam={showCreateTeam}
            setShowCreateTeam={setShowCreateTeam}
            teamName={teamName}
            setTeamName={setTeamName}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            handleCreateTeam={handleCreateTeam}
            teamTypes={teamTypes}
            loading={loading}
            setLoading={setLoading}
            myTeams={myTeams}
            handleCloseCreateModal={handleCloseCreateModal}
  
          />
        )}

        <p>Jamoalarim</p>

        

        {pendingTeams.map((team) => (

          <PendingTeamCard
            key={team.id}
            team={team}
            showActions={isAdmin}
            approveTeam={approveTeam}
            rejectTeam={rejectTeam}
            showActions={false}
          />

        ))}

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

        {pendingTeams.map((team) => (

          <PendingTeamCard
            key={team.id}
            team={team}
            showActions={isAdmin}
            approveTeam={approveTeam}
            rejectTeam={rejectTeam}
            showActions={true}
          />

        ))}

      </>)}

    </div>
  )
}