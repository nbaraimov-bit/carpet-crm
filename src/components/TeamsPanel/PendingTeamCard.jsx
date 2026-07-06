import { db } from "../../firebase"
import { teamTypeMap } from "./teamTypes";
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
} from "firebase/firestore";

export default function PendingTeamCard({
  team,
  showActions,
  currentWorker,
  pendingMode,
}) {


  const approveTeam = async (team) => {
  
    try{
  
      await addDoc(collection(db,"teams"),{
  
        teamName: team.teamName,
        type: team.type,
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

  const deletePendingTeam = async (team) => {

    const ok = window.confirm(
      "Jamoani o'chirmoqchimisiz?"
    );

    if (!ok) return;

    try {

      await deleteDoc(
        doc(db, "pendingTeams", team.id)
      );

    } catch (err) {

      console.error(err);

    }

  };

  const deleteJoinRequest = async (team) => {

    const ok = window.confirm(
      "So'rovni bekor qilmoqchimisiz?"
    );

    if (!ok) return;

    try {

      await deleteDoc(
        doc(db, "joinRequests", team.id)
      );

    } catch (err) {

      console.error(err);

    }

  };

  const isRejected = team.status === "rejected";

  return (<>

    {pendingMode === "createTeam" && (

      <div className="pending-team-card">  

        <div className={`team-accent ${isRejected ? "rejected" : ""}`}></div>

        <div className="team-header">

          <div className={`team-status ${isRejected ? "rejected" : "pending"}`}>
            {isRejected ? "🔴 Rad etilgan" : "🟡 Tasdiqlanishi kutilmoqda"}
          </div>

        </div>

        <div className="team-title">
          👥 {team.teamName}
        </div>

        <div className="team-leader-info">

          <div className="team-leader">
            👤 {team.leaderName}
          </div>

          <div className="team-phone">
            📞 {team.createdBy}
          </div>

        </div>

        <div className="team-type">
          {teamTypeMap[team.type]?.icon}{" "}
          {teamTypeMap[team.type]?.title}
        </div>

        {showActions ? (

          <div className="team-footer">

            <div className="team-actions">

              <button
                className="reject-team-btn"
                onClick={() => rejectTeam(team)}
              >
                Rad etish
              </button>

              <button
                className="approve-team-btn"
                onClick={() => approveTeam(team)}
              >
                Tasdiqlash
              </button>

            </div>  

          </div>

        ) : (

          <div className="team-footer">
            {team.status === "pending" ? (  

              <>
                <div className="team-note">
                  Admin tasdiqlaganidan so'ng jamoangiz avtomatik faollashadi.
                </div>

                <button
                  className="delete-team-btn"
                  onClick={() => deletePendingTeam(team)}
                >
                  O'chirish
                </button>

              </>
            ) : (

              <>
                <div className="team-note">
                  Jamoangiz rad etildi. Uni o'chirib yangi jamoa yaratishingiz mumkin.
                </div>

                <button
                  className="delete-team-btn"
                  onClick={() => deletePendingTeam(team)}
                >
                  O'chirish
                </button>
              </>

            )}
          </div>

        )}

      </div>

    )}

    {pendingMode === "joinTeam" && (

      <div className="pending-team-card">

        <div
          className={`team-accent ${
            team.status === "rejected" ? "rejected" : ""
          }`}
        ></div>

        <div className="team-header">

          <div
            className={`team-status ${
              team.status === "rejected" ? "rejected" : "pending"
            }`}
          >

            {team.status === "rejected" ? "🔴 Rad etilgan" : "🟡 Qo'shilish so'rovi"}

          </div>

        </div>

        <div className="team-title">
          👥 {team.teamName}
        </div>

        <div className="team-leader-info">

          <div className="team-leader">
            👤 {team.name}
          </div>

          <div className="team-phone">
            📞 {team.sender}
          </div>

        </div>

        <div className="team-type">
          {teamTypeMap[team.type]?.icon}{" "}
          {teamTypeMap[team.type]?.title}
        </div>

        <div className="team-footer">

          {team.status === "pending" ? (

            <>

              <div className="team-note">
                Leader tasdiqlaganidan so'ng siz jamoaga qo'shilasiz.
              </div>

              <button
                className="delete-team-btn"
                onClick={() => deleteJoinRequest(team)}
              >
                So'rovni bekor qilish
              </button>

            </>

          ) : (

            <>

              <div className="team-note">
                Leader so'rovingizni rad etdi. Boshqa jamoaga yuborishingiz mumkin.
              </div> 

              <button
                className="delete-team-btn"
                onClick={() => deleteJoinRequest(team)}
              >
                O'chirish
              </button>

            </>

          )}

        </div>

      </div>

    )}

  </>)

}