import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { teamDefaultShares, teamTypeMap } from "./teamTypes";
import CreateTeamModal from "./CreateTeamModal";
import PremiumTeamDetail from "./PremiumTeamDetail";
import "./premium-teams.css";

export default function PremiumTeamsPanel({
  teams = [],
  setPage,
  currentWorker,
  teamEarnings = {},
  driverPrices = {},
  packingPrices = {},
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [pendingTeams, setPendingTeams] = useState([]);
  const [myJoinRequests, setMyJoinRequests] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  const isAdmin = currentWorker?.role === "admin" || currentWorker?.role === "ega";
  const isWorker = currentWorker?.role === "worker";
  const phone = currentWorker?.phone;
  const myTeams = useMemo(() => isAdmin
    ? teams
    : teams.filter((team) => phone && team.members?.[phone]), [isAdmin, phone, teams]);
  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || null;
  const pendingRequestTeamIds = new Set(myJoinRequests
    .filter((request) => request.status === "pending")
    .map((request) => request.teamId));

  useEffect(() => {
    if (!phone) return undefined;
    const pendingQuery = isAdmin
      ? collection(db, "pendingTeams")
      : query(collection(db, "pendingTeams"), where("createdBy", "==", phone));
    const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
      setPendingTeams(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (error) => setNotice(error.message || "Jamoa so‘rovlarini yuklab bo‘lmadi"));
    return unsubscribe;
  }, [isAdmin, phone]);

  useEffect(() => {
    if (!phone || !isWorker) return undefined;
    const requestsQuery = query(collection(db, "joinRequests"), where("sender", "==", phone));
    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      setMyJoinRequests(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (error) => setNotice(error.message || "Qo‘shilish so‘rovlarini yuklab bo‘lmadi"));
    return unsubscribe;
  }, [isWorker, phone]);

  useEffect(() => {
    if (!showJoin) return undefined;
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      setAvailableTeams(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (error) => setNotice(error.message || "Jamoalarni yuklab bo‘lmadi"));
    return unsubscribe;
  }, [showJoin]);

  const approveTeam = async (pendingTeam) => {
    const pendingRef = doc(db, "pendingTeams", pendingTeam.id);
    const teamRef = doc(collection(db, "teams"));
    setBusyId(pendingTeam.id);
    setNotice("");
    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(pendingRef);
        if (!snapshot.exists()) throw new Error("Jamoa so‘rovi topilmadi");
        const request = snapshot.data();
        transaction.set(teamRef, {
          teamName: request.teamName,
          type: request.type,
          leader: request.leaderName,
          createdBy: request.createdBy,
          createdAt: request.createdAt || serverTimestamp(),
          approvedBy: phone,
          approvedAt: serverTimestamp(),
          status: "active",
          members: {
            [request.createdBy]: {
              name: request.leaderName,
              phone: request.createdBy,
              rank: "leader",
              ...(teamDefaultShares[request.type] || {}),
              working: true,
            },
          },
        });
        transaction.delete(pendingRef);
      });
    } catch (error) {
      setNotice(error.message || "Jamoani tasdiqlab bo‘lmadi");
    } finally {
      setBusyId("");
    }
  };

  const rejectTeam = async (pendingTeam) => {
    setBusyId(pendingTeam.id);
    setNotice("");
    try {
      await updateDoc(doc(db, "pendingTeams", pendingTeam.id), {
        status: "rejected",
        rejectedBy: phone,
        rejectedAt: serverTimestamp(),
      });
    } catch (error) {
      setNotice(error.message || "Jamoa so‘rovini rad etib bo‘lmadi");
    } finally {
      setBusyId("");
    }
  };

  const cancelPending = async (item, collectionName) => {
    if (!window.confirm("Ushbu so‘rovni o‘chirasizmi?")) return;
    setBusyId(item.id);
    try {
      await deleteDoc(doc(db, collectionName, item.id));
    } catch (error) {
      setNotice(error.message || "So‘rovni o‘chirib bo‘lmadi");
    } finally {
      setBusyId("");
    }
  };

  const sendJoinRequest = async (team) => {
    if (!phone || team.members?.[phone] || pendingRequestTeamIds.has(team.id)) return;
    setBusyId(team.id);
    setNotice("");
    try {
      await addDoc(collection(db, "joinRequests"), {
        sender: phone,
        name: currentWorker.name,
        teamId: team.id,
        teamName: team.teamName,
        type: team.type,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setNotice(`${team.teamName} jamoasiga so‘rov yuborildi`);
    } catch (error) {
      setNotice(error.message || "So‘rov yuborilmadi");
    } finally {
      setBusyId("");
    }
  };

  if (selectedTeam) {
    return (
      <PremiumTeamDetail
        team={selectedTeam}
        currentWorker={currentWorker}
        teamEarnings={teamEarnings}
        driverPrices={driverPrices}
        packingPrices={packingPrices}
        onBack={() => setSelectedTeamId(null)}
      />
    );
  }

  const statusInfo = (team) => {
    if (team.status === "blocked" || team.blocked) return { label: "Bloklangan", kind: "blocked" };
    if (team.status === "pending") return { label: "Tasdiqlash kutilmoqda", kind: "pending" };
    return { label: "Faol", kind: "active" };
  };

  return (
    <main className="premium-teams-page">
      <header className="premium-teams-hero">
        <button className="premium-teams-back" type="button" onClick={() => setPage("home")} aria-label="Orqaga">‹</button>
        <div>
          <p className="premium-teams-eyebrow">SAKURA · JAMOALAR</p>
          <h1>Jamoa boshqaruv paneli</h1>
          <p className="premium-teams-subtitle">Jamoalarni yarating, ularga qo‘shiling va boshqaring.</p>
        </div>
      </header>

      {isWorker && (
        <div className="premium-teams-actions">
          <button type="button" className="premium-team-action create" onClick={() => setShowCreate(true)}>
            <span className="premium-team-action-icon">+</span>
            <span><strong>Jamoa yaratish</strong><small>Yangi jamoa ochish</small></span>
          </button>
          <button type="button" className="premium-team-action join" onClick={() => setShowJoin(true)}>
            <span className="premium-team-action-icon">♟</span>
            <span><strong>Jamoaga qo‘shilish</strong><small>Taklif yuborish</small></span>
          </button>
        </div>
      )}

      {notice && <div className="premium-teams-notice" role="status">{notice}</div>}

      {isWorker && <h2 className="premium-teams-section-title">Jamoalarim</h2>}
      {isAdmin && <h2 className="premium-teams-section-title">Jamoalarni boshqarish</h2>}

      {pendingTeams.map((team) => {
        const type = teamTypeMap[team.type];
        const rejected = team.status === "rejected";
        return (
          <article className={`premium-team-card pending ${rejected ? "rejected" : ""}`} key={`pending-${team.id}`}>
            <div className="premium-team-card-accent" />
            <div className="premium-team-card-copy">
              <span className={`premium-team-status ${rejected ? "blocked" : "pending"}`}>{rejected ? "Rad etilgan" : "Tasdiqlash kutilmoqda"}</span>
              <h3>{team.teamName}</h3>
              <p>{type?.icon} {type?.title || "Jamoa"}</p>
              <div className="premium-team-meta"><span>♟ {team.leaderName}</span><span>{team.createdBy}</span></div>
            </div>
            {isAdmin && !rejected && (
              <div className="premium-team-pending-actions">
                <button type="button" disabled={busyId === team.id} onClick={() => rejectTeam(team)}>Rad etish</button>
                <button type="button" disabled={busyId === team.id} onClick={() => approveTeam(team)}>{busyId === team.id ? "Kuting..." : "Tasdiqlash"}</button>
              </div>
            )}
            {!isAdmin && <button type="button" className="premium-team-more" aria-label="So‘rovni o‘chirish" disabled={busyId === team.id} onClick={() => cancelPending(team, "pendingTeams")}>⋮</button>}
          </article>
        );
      })}

      {myJoinRequests.map((request) => (
        <article className={`premium-team-card pending ${request.status === "rejected" ? "rejected" : ""}`} key={`join-${request.id}`}>
          <div className="premium-team-card-accent" />
          <div className="premium-team-card-copy">
            <span className={`premium-team-status ${request.status === "rejected" ? "blocked" : "pending"}`}>{request.status === "rejected" ? "Rad etilgan" : "Qo‘shilish so‘rovi yuborildi"}</span>
            <h3>{request.teamName}</h3>
            <p>{teamTypeMap[request.type]?.icon} {teamTypeMap[request.type]?.title}</p>
          </div>
          <button type="button" className="premium-team-more" aria-label="So‘rovni o‘chirish" disabled={busyId === request.id} onClick={() => cancelPending(request, "joinRequests")}>⋮</button>
        </article>
      ))}

      {myTeams.map((team) => {
        const type = teamTypeMap[team.type];
        const status = statusInfo(team);
        const members = Object.values(team.members || {});
        const leader = members.find((member) => member.rank === "leader");
        const teamTypeClass = team.type || "other";
        return (
          <button className={`premium-team-card active ${teamTypeClass}`} type="button" key={team.id} onClick={() => setSelectedTeamId(team.id)}>
            <div className="premium-team-card-accent" />
            <div className="premium-team-card-art" aria-hidden="true">{type?.icon || "✦"}</div>
            <div className="premium-team-card-copy">
              <span className={`premium-team-status ${status.kind}`}><i />{status.label}</span>
              <h3>{team.teamName}</h3>
              <p>{type?.icon} {type?.title || "Jamoa"}</p>
              <div className="premium-team-meta"><span>♟ {members.length} ta a’zo</span>{leader && <span>♛ {leader.name || team.leader}</span>}</div>
            </div>
            <span className="premium-team-open" aria-hidden="true">›</span>
          </button>
        );
      })}

      {!myTeams.length && !pendingTeams.length && !myJoinRequests.length && (
        <div className="premium-teams-empty"><span>✦</span><strong>Hozircha jamoa yo‘q</strong><p>Yangi jamoa yarating yoki mavjud jamoaga qo‘shiling.</p></div>
      )}

      {showCreate && (
        <CreateTeamModal
          showCreateTeam={showCreate}
          setShowCreateTeam={setShowCreate}
          myTeams={[
            ...myTeams,
            ...pendingTeams.filter((team) => team.status === "pending"),
          ]}
          currentWorker={currentWorker}
        />
      )}

      {showJoin && (
        <div className="premium-team-modal-overlay" onClick={() => setShowJoin(false)}>
          <section className="premium-team-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="premium-team-modal-close" onClick={() => setShowJoin(false)}>×</button>
            <p className="premium-teams-eyebrow">JAMOANI TANLANG</p>
            <h2>Jamoaga qo‘shilish</h2>
            <div className="premium-team-join-list">
              {availableTeams.filter((team) => !team.members?.[phone] && !team.blocked && team.status !== "blocked").map((team) => {
                const type = teamTypeMap[team.type];
                const requested = pendingRequestTeamIds.has(team.id);
                return (
                  <div className="premium-team-join-row" key={team.id}>
                    <div><strong>{team.teamName}</strong><small>{type?.icon} {type?.title}</small></div>
                    <button type="button" disabled={requested || busyId === team.id} onClick={() => sendJoinRequest(team)}>{requested ? "Yuborildi" : busyId === team.id ? "Kuting..." : "So‘rash"}</button>
                  </div>
                );
              })}
              {!availableTeams.some((team) => !team.members?.[phone] && !team.blocked && team.status !== "blocked") && <p className="premium-team-join-empty">Qo‘shilish mumkin bo‘lgan jamoa topilmadi.</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
