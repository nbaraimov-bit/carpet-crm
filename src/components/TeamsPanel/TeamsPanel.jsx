import { db } from "../../firebase"
import { useState, useEffect } from "react"
import "./teams.css"
import PendingTeamCard from "./PendingTeamCard";
import CreateTeamModal from "./CreateTeamModal";
import ActiveTeamCard from "./ActiveTeams/ActiveTeamCard";
import ActiveTeamDetail from "./ActiveTeams/ActiveTeamDetail";
import JoinTeamModal from "./JoinTeamModal";

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
  teamEarnings,
  driverPrices,
  washerPrices,
  packingPrices,

}) {

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [pendingTeams, setPendingTeams] = useState([])
  const [teamMode, setTeamMode] = useState("list");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [pendingJoinTeams, setPendingJoinTeams] = useState([]);

  const isAdmin = currentWorker?.roles?.includes("admin") || currentWorker?.roles?.includes("ega")
  const isWorker = currentWorker?.roles?.includes("worker")
  
  const myTeams = isAdmin ? teams : teams.filter(team => team.members?.[currentWorker.phone]);

  const hasTeam = myTeams.length > 0;

  const openTeam = (team) => {
    setSelectedTeam(team);
    setTeamMode("detail");
  }
  const closeTeam = () => {
    setSelectedTeam(null);
    setTeamMode("list");
  }

  useEffect(() => {

  if (!selectedTeam) return;

  const updatedTeam = teams.find(
    t => t.id === selectedTeam.id
  );

  if (updatedTeam) {
    setSelectedTeam(updatedTeam);
  }

}, [teams]);

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

  useEffect(() => {

    if (!isWorker) return;

    const q = query(
      collection(db, "joinRequests"),
      where("sender", "==", currentWorker.phone)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const list = snapshot.docs.map(doc => ({

        id: doc.id,
        ...doc.data(),

      }));

      setPendingJoinTeams(list);

    });

    return () => unsubscribe();

  }, [currentWorker.phone, isWorker]);

  const pendingCards = [

    ...pendingTeams.filter(team => isWorker || team.status !== "rejected")
    .map(team => (

      <PendingTeamCard
        key={`create-${team.id}`}
        team={team}
        pendingMode="createTeam"
        showActions={isAdmin}
        currentWorker={currentWorker}
      />

    )),

    ...pendingJoinTeams.map(team => (

      <PendingTeamCard
        key={`join-${team.id}`}
        team={team}
        pendingMode="joinTeam"
        currentWorker={currentWorker}
      />

    )),

  ];

  const activeCards = myTeams.map((team) => (

    <ActiveTeamCard
      team={team}
      currentWorker={currentWorker}
      isAdmin={isAdmin}
      openTeam={openTeam}
    />

  ));

  return (<>

    {teamMode === "list" && (
      <div>
     
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
 
            <button 
              style={{ marginLeft: 10 }}
              onClick={() => setShowJoinTeam(true)}
            >
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

          {showJoinTeam && (
            <JoinTeamModal

              setShowJoinTeam={setShowJoinTeam}
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
    )}
  

    {teamMode === "detail" && (

      <ActiveTeamDetail
        team={selectedTeam}
        currentWorker={currentWorker}
        closeTeam={closeTeam}
        role={role}
        teamEarnings={teamEarnings}
        driverPrices={driverPrices}
        packingPrices={packingPrices}
        washerPrices={washerPrices}
      />
    )}

  </>)  
        
}