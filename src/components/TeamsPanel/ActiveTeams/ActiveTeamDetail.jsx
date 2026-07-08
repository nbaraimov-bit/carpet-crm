import { db } from "../../../firebase"
import { useState, useEffect } from "react"
import "./ActiveTeams.css"
import teamTypes, { teamTypeMap } from "../teamTypes";
import TeamLeaderPanel from "./TeamLeaderPanel";
import TeamInfoCard from "./TeamInfoCard";
import TeamMemberCard from "./TeamMemberCard";
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
    openTeam,
    allowedRoles,
    role,

}) {

  const [earnings, setEarnings] = useState({});
  const [washerPrices, setWasherPrices] = useState(null);
  const [memberPrices, setMemberPrices] = useState({});

  const workingCount = Object.values(team.members || {})
  .filter(member => member.working)
  .length;
  const teamType = teamTypeMap[team.type];
  const members = Object.values(team.members || {}).sort((a, b) => {
    if (a.rank === "leader") return -1;
    if (b.rank === "leader") return 1;
    return 0;
  });
  const teamMember = team.members?.[currentWorker.phone];
  const activeMembers = members.filter(member => member.working);
  const isLeader = teamMember?.rank === "leader";
  const isMember = teamMember?.rank === "member";
  const isAdmin = allowedRoles.includes("admin") || allowedRoles.includes("ega");

  useEffect(() => {
  if (!team?.members) return;

  setMemberPrices(
    JSON.parse(JSON.stringify(team.members))
  );
}, [team]);

  useEffect(() => {

  const unsubscribe = onSnapshot(

    doc(db, "settings", "washerPrices"),

    (snapshot) => {

      if (snapshot.exists()) {
        setWasherPrices(snapshot.data());
      }

    }

  );

  return unsubscribe;

}, []);

  useEffect(() => {

    const today = new Date() .toISOString() .slice(0, 10);

    const unsubscribe = onSnapshot(

      doc(db, "workerEarnings", today),

      (snapshot) => {

        if (snapshot.exists()) {
          setEarnings(snapshot.data());
        } else {
          setEarnings({});
        }

      }

    );

    return () => unsubscribe();

  }, []);

  return (

    <div>

      <div>

        <button onClick={closeTeam}>
          ⬅️
        </button>

        <TeamInfoCard
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

        members.map((member) => (
          <TeamLeaderPanel
            mode={"memberPrices"}
            team={team}
            currentWorker={currentWorker}
            member={member}
            washerPrices={washerPrices}
            memberPrices={memberPrices}
            setMemberPrices={setMemberPrices}
          />
        ))

      ) : (
        
        members.map((member) => (
          <TeamMemberCard
            key={members.phone}
            team={team}
            member={member}
            currentWorker={currentWorker}
            earnings={earnings}
          />
        ))

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