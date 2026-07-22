import "./ActiveTeams.css"
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { 
  teamTypeMap,
  teamDefaultShares,
} from "../teamTypes";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";

export default function TeamLeaderPanel({
  team,
  currentWorker,
  mode,
  member,
  washerPrices,
  memberPrices,
  setMemberPrices,
  updateMemberPrice,
  limits,
  canSave,
  earnings,
  toggleWorking,
  removeMember,
}) {

  const [joinRequests, setJoinRequests] = useState([]);

  const teamType = teamTypeMap[team.type];
  const services = teamType?.services || [];


  useEffect(() => {

    if (!team?.id) return;

    const q = query(

      collection(db, "joinRequests"),
      where("teamId", "==", team.id),
      where("status", "==", "pending")

    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const list = snapshot.docs.map(doc => ({

        id: doc.id,
        ...doc.data(),

      }));

      setJoinRequests(list);

    });

    return () => unsubscribe();

  }, [team]);


  const approveJoinRequest = async (request) => {

    try {

      await updateDoc(

        doc(db, "teams", team.id),

        {

          [`members.${request.sender}`]: {

            name: request.name,
            phone: request.sender,
            rank: "member",
            ...teamDefaultShares[team.type],
            working: true,

          },

        }

      );

      await deleteDoc(
        doc(db, "joinRequests", request.id)
      );

    } catch (err) {

      console.error(err);

    }

  };


  const rejectJoinRequest = async (request) => {

    try {

      await updateDoc(

        doc(db, "joinRequests", request.id),

        {
          status: "rejected",
          rejectedBy: currentWorker.phone,
          rejectedAt: serverTimestamp(),
        }

      );

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <>

      {mode === "joinRequests" && (<>

        {joinRequests.map((request) => (

          <div
            key={request.id}
            className="join-request-card"
          >

            <div className="join-request-accent"></div>

            <div className="join-request-header">

              <div className="join-request-title">
                📋 Qo'shilish so'rovi
              </div>

              <div className="join-request-status">
                Kutilmoqda
              </div>

            </div>

            <div className="join-request-worker">
              👤 {request.name}
            </div>

            <div className="join-request-role">
              {teamTypeMap[request.type]?.icon}{" "}
              {teamTypeMap[request.type]?.title}
            </div>

            <div className="join-request-buttons">

              <button className="reject-button"
                onClick={() => rejectJoinRequest(request)}
              >
                ❌ Rad etish
              </button>

              <button className="approve-button"
                onClick={() => approveJoinRequest(request)}
              >
                ✅ Tasdiqlash
              </button>

            </div>

          </div>

        ))}

      </>)}

      {/* ===== Leader uchun MemberCardlar ===== */}
      {mode === "memberPrices" && (

        <div className="member-card">
  
          <div className="member-accent"></div>

          <div className="member-header">

            <div>

              <div className="member-name">
                👤 {member.name}
              </div>

              <div className="member-rank">
                {member.rank === "leader" ? "👑 Leader" : "👤 Member"}
              </div>

            </div>

            <div className={`member-status ${member.working ? "active" : ""}`}>
              {member.working ? "🟢 Faol" : "⚪️ Nofaol"}
            </div>

          </div>

          <div className="member-price-grid">

            {services.map((service) => (

              <div
                className="member-price-box"
                key={service.key}
              >
               
                <div className="member-price-title">
                  {service.icon} {service.title}
                </div>

                <input
                  className="member-price-input"
                  value={memberPrices[member.phone]?.[service.key] ?? 0}
                  onChange={(e) =>
                    updateMemberPrice(
                      member.phone, service.key, e.target.value
                    )
                  }
                />

              </div>

            ))}

          </div>

          <div className="member-salary">

            💰 Bugungi ish haqi
 
            <b>{(earnings?.[member.phone]?.washerSalary ?? 0) .toLocaleString()} so'm </b>

          </div>

          {member.rank !== "leader" && (
            <div className="member-actions">

              <button 
                className="remove-member-btn"
                onClick={removeMember}
              >
                Chiqarib yuborish
              </button>

              <button
                className={`working-btn ${member.working ? "active" : "inactive"}`}
                onClick={toggleWorking}
              >
                {member.working ? "🟢 Faol" : "⚪️ Nofaol"}
              </button>

            </div>
          )}

        </div>

      )}

    </>
  );

  return null
} 