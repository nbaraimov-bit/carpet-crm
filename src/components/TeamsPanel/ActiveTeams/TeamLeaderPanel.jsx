import "./ActiveTeams.css"
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { teamTypeMap } from "../teamTypes";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
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
}) {

  const [joinRequests, setJoinRequests] = useState([]);

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
            carpet: 0,
            blanket: 0,
            yakandoz: 0,
            curtain: 0,
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

  

console.log({
  carpet: isCarpetValid,
  blanket: isBlanketValid,
  yakandoz: isYakandozValid,
  curtain: isCurtainValid,
  canSave,
});

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

          <div className="member-prices-grid">

            <div>🧼 Gilam</div>
            <div>
              <input
                className="member-price-input"
                value={memberPrices[member.phone]?.carpet ?? 0}
                onChange={(e) => updateMemberPrice(
                  member.phone,
                  "carpet",
                  e.target.value
                )}
              />
            </div>

            <div>🛏️ Adyol</div>
            <div>
              <input
                className="member-price-input"
                value={memberPrices[member.phone]?.blanket ?? 0}
                onChange={(e) => updateMemberPrice(
                  member.phone,
                  "blanket",
                  e.target.value
                )}   
              />
            </div>

            <div>🧵 Yakandoz</div>
            <div>
              <input
                className="member-price-input"
                value={memberPrices[member.phone]?.yakandoz ?? 0}
                onChange={(e) => updateMemberPrice(
                  member.phone,
                  "yakandoz",
                  e.target.value
                )}
              />
            </div>

            <div>🪟 Parda</div>
            <div>
              <input
                className="member-price-input"
                value={memberPrices[member.phone]?.curtain ?? 0}
                onChange={(e) => updateMemberPrice(
                  member.phone,
                  "curtain",
                  e.target.value
                )}
              />
            </div>

          </div>

          <div className="member-salary">

            💰 Bugungi ish haqi

            <b>0 so'm</b>

          </div>

          <div className="member-actions">

            <button className="remove-member-btn">
              🚪 Chiqarib yuborish
            </button>

            <button className="working-btn">
              ⚪️ Nofaol
            </button>

          </div>

        </div>

      )}

    </>
  );

  return null
} 