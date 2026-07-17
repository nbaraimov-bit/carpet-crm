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
    teamEarnings,
    driverPrices,
    packingPrices,
    washerPrices,

}) {

  const [earnings, setEarnings] = useState({});
  const [memberPrices, setMemberPrices] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);

  const workingCount = Object.values(team.members || {})
  .filter(member => member.working)
  .length;
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
  const teamType = teamTypeMap[team.type];
  const services = teamType?.services || [];

  useEffect(() => {
    if (!team?.members) return;

    setMemberPrices(
      JSON.parse(JSON.stringify(team.members))
    );
  }, [team]);


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


  const deleteTeam = async () => {

    const ok = window.confirm(
      `"${team.teamName}" jamoasi o'chirilsinmi?\n\nBu amalni ortga qaytarib bo'lmaydi.`
    );

    if (!ok) return;

    try {

      await deleteDoc(doc(db, "teams", team.id));
      closeTeam();

    } catch (err) {

      console.error(err);
      alert("Jamoani o'chirib bo'lmadi.");

    }

  };


  const updateMemberPrice = (phone, field, value) => {

    setMemberPrices(prev => ({
      ...prev,
      [phone]: {
        ...prev[phone],
        [field]: Number(value) || 0,
      },
    }));

    if (!showSaveModal) { setShowSaveModal(true); }

  };


  const handleCancelChanges = () => {

    setMemberPrices(
      JSON.parse(JSON.stringify(team.members))
    );

    setShowSaveModal(false);

  };

  const handleSaveChanges = async () => {

    if (!canSave) return;

    try {

      await updateDoc(

        doc(db, "teams", team.id),
        {members: memberPrices,}

      );

      setShowSaveModal(false);

    } catch (err) {

      console.error(err);

    }

  };

  const calculateLimits = () => {

    const workingMembers = Object.values(memberPrices) .filter(member => member.working);

    return {

      carpet: {
        total: workingMembers.reduce(
          (sum, member) => sum + (member.carpet || 0),
          0
        ),
        limit: washerPrices?.carpet ?? 0,
      },

      blanket: {
        total: workingMembers.reduce(
          (sum, member) => sum + (member.blanket || 0),
          0
        ),
        limit: washerPrices?.blanket ?? 0,
      },

      yakandoz: {
        total: workingMembers.reduce(
          (sum, member) => sum + (member.yakandoz || 0),
          0
        ),
        limit: washerPrices?.yakandoz ?? 0,
      },

      curtain: {
        total: workingMembers.reduce(
          (sum, member) => sum + (member.curtain || 0),
          0
        ),
        limit: washerPrices?.curtain ?? 0,
      },

    };

  };

  const toggleWorking = async () => {
  
    const teamRef = doc(db, "teams", team.id);
  
    await updateDoc(teamRef, {
      [`members.${member.phone}.working`]: !member.working
    });
  
  };
  
  
  const removeMember = async () => {
  
    const ok = window.confirm(`${member.name} ni jamoadan chiqarilsinmi?`);
  
    if (!ok) return;
  
    try {
  
      const teamRef = doc(db, "teams", team.id);
  
      await updateDoc(teamRef, {
        [`members.${member.phone}`]: deleteField(),
      });
  
    } catch (err) {
  
      console.error(err);
  
      alert("Xatolik yuz berdi");
  
    }
  
  };

const limits = calculateLimits();

const isCarpetValid = limits.carpet.total === limits.carpet.limit;
const isBlanketValid = limits.blanket.total === limits.blanket.limit;
const isYakandozValid = limits.yakandoz.total === limits.yakandoz.limit;
const isCurtainValid = limits.curtain.total === limits.curtain.limit;
const canSave = isCarpetValid && isBlanketValid && isYakandozValid && isCurtainValid;
const useLeaderPanel = team.type === "washer" && isLeader;

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
          todayTeam={teamEarnings[team.id] || {}}
        />

      </div>

      {isLeader && <TeamLeaderPanel
        
        mode="joinRequests"
        team={team}
        currentWorker={currentWorker}
        memberPrices={memberPrices}
        setMemberPrices={setMemberPrices}


      />}

      {useLeaderPanel ? (

        members.map((member) => (
          <TeamLeaderPanel
            mode={"memberPrices"}
            team={team}
            currentWorker={currentWorker}
            member={member}
            washerPrices={washerPrices}
            memberPrices={memberPrices}
            setMemberPrices={setMemberPrices}
            updateMemberPrice={updateMemberPrice}
            limits={limits}
            canSave={canSave}
            earnings={earnings}
            toggleWorking={toggleWorking}
            removeMember={removeMember}
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
            driverPrices={driverPrices}
            packingPrices={packingPrices}
            washerPrices={washerPrices}
            toggleWorking={toggleWorking}
            removeMember={removeMember}
            isLeader={isLeader}
          />
        ))

      )}

      {(isLeader || isAdmin) && (

        <div 
          className="delete-team-card"
          onClick={deleteTeam}
        >

          <div className="delete-team-title">
            🗑️ Jamoani o'chirish
          </div>

          <div className="delete-team-description">
            Jamoani va unga tegishli barcha ma'lumotlarni o'chiradi.
          </div>

        </div>

      )}

      {showSaveModal && (

        <div className="save-modal">

          <div className="save-modal-card">

            <div className="save-limit-grid">

              {services.map((service) => {

                const item = limits[service.key];

                return (
    
                  <div
                    key={service.key}
                    className={
                      item.total === item.limit ? "save-limit-card success" : "save-limit-card error"
                    }
                  >

                    <div className="save-limit-title">
                      {service.icon} {service.title}
                    </div>
 
                    <div className="save-limit-value">
                      {item.total} / {item.limit}
                    </div>

                  </div>

                );

              })}

            </div>
          

            <div className="save-actions">

              <button
              className="cancel-btn"
                onClick={handleCancelChanges}
              >
                Bekor qilish
              </button>

              <button
              className={canSave ? "save-btn" : "save-btn disabled"}
                disabled={!canSave}
                onClick={handleSaveChanges}
              >
                Saqlash
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}