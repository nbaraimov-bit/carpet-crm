import { useEffect, useMemo, useState } from "react";
import {
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
import { db } from "../../../firebase";
import { teamDefaultShares, teamTypeMap } from "./teamTypes";
import WasherPriceDistributionModal from "./WasherPriceDistributionModal";
import carpetIcon from "../../MainIcons/carpetIcon.png";
import blanketIcon from "../../MainIcons/blanketIcon.png";
import yakandozIcon from "../../MainIcons/yakandozIcon.png";
import curtainIcon from "../../MainIcons/curtainIcon.png";
import totalIcon from "../../Pages/Home/Assets/jamiIcon.png";
import washerIcon from "../../Pages/Home/Assets/washerIcon.png";
import packingIcon from "../../Pages/Home/Assets/packingIcon.png";
import driverIcon from "../../Pages/Home/Assets/driverIcon.png";

const washerLimits = {
  carpetSt: 1500,
  carpetPro: 2000,
  blanket1x: 4000,
  blanket2x: 5000,
  matras: 8000,
  yakandozM: 2000,
  yakandozS: 4000,
  yakandozL: 6000,
};
const packingRates = {
  carpet: 300,
  blanket1x: 800,
  blanket2x: 1000,
  matras: 2000,
  yakandozM: 500,
  yakandozS: 1000,
  yakandozL: 1500,
};
const driverPickupRates = { carpet: 700, blanket1x: 1200, blanket2x: 1500, matras: 2000, yakandozM: 750, yakandozS: 1500, yakandozL: 1800 };
const driverDeliveryRates = { carpet: 500, blanket: 1000, yakandozM: 500, yakandozS: 1000, yakandozL: 1200 };
const money = (value) => Number(value || 0).toLocaleString("uz-UZ");

export default function TeamDetail({ team, currentWorker, teamEarnings = {}, driverPrices = {}, packingPrices = {}, onBack }) {
  const [dailyEarnings, setDailyEarnings] = useState({});
  const [joinRequests, setJoinRequests] = useState([]);
  const [showDistribution, setShowDistribution] = useState(false);
  const [savingDistribution, setSavingDistribution] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const members = useMemo(() => Object.entries(team.members || {})
    .map(([key, member]) => ({ key, member }))
    .sort((a, b) => (a.member.rank === "leader" ? -1 : b.member.rank === "leader" ? 1 : 0)), [team.members]);
  const activeMembers = members.filter(({ member }) => member.working);
  const currentMember = team.members?.[currentWorker?.phone];
  const isLeader = currentMember?.rank === "leader";
  const isAdmin = currentWorker?.role === "admin" || currentWorker?.role === "ega";
  const canManage = isLeader || isAdmin;
  const teamType = teamTypeMap[team.type];
  const todayTeam = teamEarnings?.[team.id] || {};

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    return onSnapshot(doc(db, "workerEarnings", today), (snapshot) => {
      setDailyEarnings(snapshot.exists() ? snapshot.data() : {});
    }, (error) => setNotice(error.message || "Bugungi ish haqini yuklab bo‘lmadi"));
  }, []);

  useEffect(() => {
    if (!canManage || !team.id) return undefined;
    const requestsQuery = query(
      collection(db, "joinRequests"),
      where("teamId", "==", team.id),
      where("status", "==", "pending")
    );
    return onSnapshot(requestsQuery, (snapshot) => {
      setJoinRequests(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (error) => setNotice(error.message || "Qo‘shilish so‘rovlarini yuklab bo‘lmadi"));
  }, [canManage, team.id]);

  const updateMembers = async (change) => {
    const teamRef = doc(db, "teams", team.id);
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(teamRef);
      if (!snapshot.exists()) throw new Error("Jamoa topilmadi");
      const latest = snapshot.data();
      const nextMembers = change({ ...(latest.members || {}) });
      transaction.update(teamRef, { members: nextMembers });
    });
  };

  const toggleMember = async (key) => {
    setBusy(true);
    setNotice("");
    try {
      await updateMembers((nextMembers) => {
        const existing = nextMembers[key];
        if (!existing) throw new Error("A’zo topilmadi");
        nextMembers[key] = { ...existing, working: !existing.working };
        return nextMembers;
      });
    } catch (error) {
      setNotice(error.message || "A’zo holatini o‘zgartirib bo‘lmadi");
    } finally {
      setBusy(false);
    }
  };

  const removeMember = async ({ key, member }) => {
    if (member.rank === "leader") return;
    if (!window.confirm(`${member.name || key} ni jamoadan chiqarasizmi?`)) return;
    setBusy(true);
    setNotice("");
    try {
      await updateMembers((nextMembers) => {
        delete nextMembers[key];
        return nextMembers;
      });
    } catch (error) {
      setNotice(error.message || "A’zoni chiqarib bo‘lmadi");
    } finally {
      setBusy(false);
    }
  };

  const approveJoinRequest = async (request) => {
    const teamRef = doc(db, "teams", team.id);
    const requestRef = doc(db, "joinRequests", request.id);
    setBusy(true);
    setNotice("");
    try {
      await runTransaction(db, async (transaction) => {
        const [teamSnapshot, requestSnapshot] = await Promise.all([
          transaction.get(teamRef), transaction.get(requestRef),
        ]);
        if (!teamSnapshot.exists() || !requestSnapshot.exists()) throw new Error("So‘rov yoki jamoa topilmadi");
        const latestTeam = teamSnapshot.data();
        const latestRequest = requestSnapshot.data();
        if (latestTeam.members?.[latestRequest.sender]) {
          transaction.delete(requestRef);
          return;
        }
        transaction.update(teamRef, {
          members: {
            ...(latestTeam.members || {}),
            [latestRequest.sender]: {
            name: latestRequest.name,
            phone: latestRequest.sender,
            rank: "member",
            ...(teamDefaultShares[team.type] || {}),
            working: true,
            },
          },
        });
        transaction.delete(requestRef);
      });
    } catch (error) {
      setNotice(error.message || "So‘rovni tasdiqlab bo‘lmadi");
    } finally {
      setBusy(false);
    }
  };

  const rejectJoinRequest = async (request) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, "joinRequests", request.id), {
        status: "rejected",
        rejectedBy: currentWorker?.phone || "admin",
        rejectedAt: serverTimestamp(),
      });
    } catch (error) {
      setNotice(error.message || "So‘rovni rad etib bo‘lmadi");
    } finally {
      setBusy(false);
    }
  };

  const saveWasherDistribution = async (distribution) => {
    const activeKeys = activeMembers.map(({ key }) => key).sort();
    const totals = Object.fromEntries(Object.keys(washerLimits).map((key) => [key, 0]));
    for (const memberKey of activeKeys) {
      for (const field of Object.keys(washerLimits)) {
        const value = Number(distribution[memberKey]?.[field] ?? 0);
        if (!Number.isInteger(value) || value < 0) {
          setNotice("Narxlar manfiy bo‘lmasin va butun son kiriting");
          return;
        }
        totals[field] += value;
      }
    }
    const invalid = Object.keys(washerLimits).find((field) => totals[field] !== washerLimits[field]);
    if (invalid) {
      setNotice("Har bir mahsulot bo‘yicha jami belgilangan limitga teng bo‘lishi kerak");
      return;
    }

    setSavingDistribution(true);
    setNotice("");
    try {
      const teamRef = doc(db, "teams", team.id);
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(teamRef);
        if (!snapshot.exists()) throw new Error("Jamoa topilmadi");
        const latest = snapshot.data();
        const latestActiveKeys = Object.entries(latest.members || {})
          .filter(([, member]) => member.working)
          .map(([key]) => key)
          .sort();
        if (latestActiveKeys.join("|") !== activeKeys.join("|")) {
          throw new Error("Faol a’zolar o‘zgargan. Modalni qayta ochib, taqsimotni yangilang.");
        }
        const nextMembers = { ...(latest.members || {}) };
        for (const key of activeKeys) {
          nextMembers[key] = {
            ...nextMembers[key],
            ...Object.fromEntries(Object.keys(washerLimits).map((field) => [field, Number(distribution[key]?.[field] ?? 0)])),
          };
        }
        transaction.update(teamRef, {
          members: nextMembers,
          washerSharesUpdatedAt: serverTimestamp(),
          washerSharesUpdatedBy: currentWorker?.phone || "",
        });
      });
      setShowDistribution(false);
    } catch (error) {
      setNotice(error.message || "Narxlarni saqlab bo‘lmadi");
    } finally {
      setSavingDistribution(false);
    }
  };

  const deleteTeam = async () => {
    if (!window.confirm(`“${team.teamName}” jamoasini o‘chirasizmi?`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "teams", team.id));
      onBack();
    } catch (error) {
      setNotice(error.message || "Jamoani o‘chirib bo‘lmadi");
    } finally {
      setBusy(false);
    }
  };

  const serviceStats = team.type === "driver"
    ? [
      { key: "carpet", label: "Gilam", icon: carpetIcon, unit: "kv", quantity: "deliveryCarpetKvm", salary: "deliveryCarpetSalary", secondQuantity: "pickupCarpetKvm", secondSalary: "pickupCarpetSalary" },
      { key: "blanket", label: "Adyol", icon: blanketIcon, unit: "ta", quantity: "deliveryBlanketCount", salary: "deliveryBlanketSalary", secondQuantity: "pickupBlanketCount", secondSalary: "pickupBlanketSalary" },
      { key: "yakandoz", label: "Yakandoz", icon: yakandozIcon, unit: "ta", quantity: "deliveryYakandozCount", salary: "deliveryYakandozSalary", secondQuantity: "pickupYakandozCount", secondSalary: "pickupYakandozSalary" },
      { key: "curtain", label: "Parda", icon: curtainIcon, unit: "m", quantity: "deliveryCurtainMeter", salary: "deliveryCurtainSalary", secondQuantity: "pickupCurtainMeter", secondSalary: "pickupCurtainSalary" },
    ]
    : [
      { key: "carpet", label: "Gilam", icon: carpetIcon, unit: "kv", quantity: "carpetKvm", salary: "carpetSalary" },
      { key: "blanket", label: "Adyol", icon: blanketIcon, unit: "ta", quantity: "blanketCount", salary: "blanketSalary" },
      { key: "yakandoz", label: "Yakandoz", icon: yakandozIcon, unit: "ta", quantity: "yakandozCount", salary: "yakandozSalary" },
      { key: "curtain", label: "Parda", icon: curtainIcon, unit: "m", quantity: "curtainMeter", salary: "curtainSalary" },
    ];

  const memberProducts = (member) => {
    if (team.type === "washer") return [
      { icon: carpetIcon, title: "Gilam", lines: [`ST · ${money(member.carpetSt)} so‘m`, `PRO · ${money(member.carpetPro)} so‘m`] },
      { icon: blanketIcon, title: "Adyol", lines: [`1x · ${money(member.blanket1x)}`, `2x · ${money(member.blanket2x)}`, `Matras · ${money(member.matras)}`] },
      { icon: yakandozIcon, title: "Yakandoz", lines: [`M · ${money(member.yakandozM)}`, `S · ${money(member.yakandozS)}`, `L · ${money(member.yakandozL)}`] },
      { icon: curtainIcon, title: "Parda", lines: [`${money(member.curtain)} so‘m`] },
    ];
    if (team.type === "packing") {
      const share = (value) => member.working && activeMembers.length ? Number(value || 0) / activeMembers.length : 0;
      return [
        { icon: carpetIcon, title: "Gilam", lines: [`${money(share(packingRates.carpet))} so‘m / kv`] },
        { icon: blanketIcon, title: "Adyol", lines: [`1x · ${money(share(packingRates.blanket1x))}`, `2x · ${money(share(packingRates.blanket2x))}`, `Matras · ${money(share(packingRates.matras))}`] },
        { icon: yakandozIcon, title: "Yakandoz", lines: [`M · ${money(share(packingRates.yakandozM))}`, `S · ${money(share(packingRates.yakandozS))}`, `L · ${money(share(packingRates.yakandozL))}`] },
        { icon: curtainIcon, title: "Parda", lines: [`${money(share(packingPrices.curtain))} so‘m`] },
      ];
    }
    const driverShare = (total) => {
      if (!member.working || !activeMembers.length) return 0;
      if (activeMembers.length === 1) return activeMembers[0].key === member.phone ? total : 0;
      const leaderCount = activeMembers.filter(({ member: active }) => active.rank === "leader").length;
      const nonLeaderCount = activeMembers.length - leaderCount;
      if (leaderCount === 1 && nonLeaderCount > 0) {
        return member.rank === "leader" ? total * 0.55 : (total * 0.45) / nonLeaderCount;
      }
      return total / activeMembers.length;
    };
    return [
      { icon: carpetIcon, title: "Gilam", lines: [`Olish · ${money(driverShare(driverPickupRates.carpet))}`, `Yetkazish · ${money(driverShare(driverDeliveryRates.carpet))}`] },
      { icon: blanketIcon, title: "Adyol", lines: [`1x · ${money(driverShare(driverPickupRates.blanket1x))}`, `2x · ${money(driverShare(driverPickupRates.blanket2x))}`, `Matras · ${money(driverShare(driverPickupRates.matras))}`, `Yetkazish · ${money(driverShare(driverDeliveryRates.blanket))}`] },
      { icon: yakandozIcon, title: "Yakandoz", lines: [`M · ${money(driverShare(driverPickupRates.yakandozM))} / ${money(driverShare(driverDeliveryRates.yakandozM))}`, `S · ${money(driverShare(driverPickupRates.yakandozS))} / ${money(driverShare(driverDeliveryRates.yakandozS))}`, `L · ${money(driverShare(driverPickupRates.yakandozL))} / ${money(driverShare(driverDeliveryRates.yakandozL))}`] },
      { icon: curtainIcon, title: "Parda", lines: [`Olish · ${money(driverShare(driverPrices.pickupCurtain))}`, `Yetkazish · ${money(driverShare(driverPrices.deliveryCurtain))}`] },
    ];
  };

  const handleOpenDistribution = () => setShowDistribution(true);

  return (
    <main className="team-detail-page">
      <header className="detail-topbar">
        <button type="button" className="detail-back" onClick={onBack}>‹ <span>Jamoalar</span></button>
        {team.type === "washer" && canManage && (
          <button type="button" className="distribution-button" onClick={handleOpenDistribution}>↗ <span>Narxlarni taqsimlash</span></button>
        )}
      </header>

      <section className="detail-hero">
        <div className="detail-identity">
          <div className={`detail-art ${team.type}`}><img src={team.type === "washer" ? washerIcon : team.type === "packing" ? packingIcon : driverIcon} alt="" /></div>
          <div>
          <span className={`team-status ${team.status === "blocked" ? "blocked" : "active"}`}><i />{team.status === "blocked" ? "Bloklangan" : "Faol"}</span>
          <h1>{team.teamName}</h1>
          <p>{teamType?.title}</p>
          </div>
        </div>
        <div className="detail-active-count"><span className="online-dot" />{activeMembers.length} kishi faol</div>
      </section>

      {notice && <div className="teams-notice" role="status">{notice}</div>}

      <section className="team-stats-grid">
        {serviceStats.map((service) => (
          <article className="team-stat" key={service.key}>
            <div className="team-stat-heading"><img src={service.icon} alt={service.label} /></div>
            {team.type === "driver" ? (
              <>
                <p><span>Yetkazish</span><b>{money(todayTeam[service.quantity])} {service.unit} · {money(todayTeam[service.salary])} so‘m</b></p>
                <p><span>Olish</span><b>{money(todayTeam[service.secondQuantity])} {service.unit} · {money(todayTeam[service.secondSalary])} so‘m</b></p>
              </>
            ) : (
              <p><span>{money(todayTeam[service.quantity])} {service.unit}</span><b>{money(todayTeam[service.salary])} so‘m</b></p>
            )}
          </article>
        ))}
      </section>
      <div className="team-total"><span><img src={totalIcon} alt="" /> Jami ish haqi</span><strong>{money(todayTeam.salary)} so‘m</strong></div>

      {canManage && joinRequests.length > 0 && (
        <section className="join-requests">
          <h2>Qo‘shilish so‘rovlari</h2>
          {joinRequests.map((request) => (
            <div className="join-request" key={request.id}>
              <div><strong>{request.name}</strong><small>{request.sender}</small></div>
              <div className="join-request-actions">
                <button type="button" disabled={busy} onClick={() => rejectJoinRequest(request)}>Rad etish</button>
                <button type="button" disabled={busy} onClick={() => approveJoinRequest(request)}>Tasdiqlash</button>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="members-section">
        <div className="members-title"><h2>Jamoa a’zolari</h2><span>{members.length} kishi</span></div>
        {members.map(({ key, member }) => {
          const products = memberProducts({ ...member, phone: member.phone || key });
          const salaryField = team.type === "packing" ? "packingSalary" : team.type === "driver" ? "driverSalary" : "washerSalary";
          return (
            <article className={`member-card ${member.working ? "" : "inactive"}`} key={key}>
              <header className="member-header">
                <div className="member-avatar">{(member.name || "?").trim().charAt(0).toUpperCase()}</div>
                <div className="member-name"><h3>{member.name || key}</h3><p>{member.rank === "leader" ? "Jamoa rahbari" : "Jamoa a’zosi"}</p></div>
                <span className={`member-status ${member.working ? "active" : "inactive"}`}><i />{member.working ? "Faol" : "Nofaol"}</span>
              </header>

              <div className="member-products">
                {products.map((product) => (
                  <div className="member-product" key={product.title}>
                    <div className="member-product-title"><img src={product.icon} alt={product.title} /></div>
                    <div className="member-product-values">{product.lines.map((line) => <span key={line}>{line}</span>)}</div>
                  </div>
                ))}
              </div>

              <div className="member-salary"><span><img src={totalIcon} alt="" /> Bugungi ish haqi</span><strong>{money(dailyEarnings?.[member.phone || key]?.[salaryField])} so‘m</strong></div>

              {canManage && (
                <div className="member-actions">
                  {member.rank !== "leader" && <button type="button" className="member-remove" disabled={busy} onClick={() => removeMember({ key, member })}>Jamoadan chiqarish</button>}
                  <button type="button" className={`member-toggle ${member.working ? "active" : "inactive"}`} disabled={busy} onClick={() => toggleMember(key)}>{member.working ? "Faollikni o‘chirish" : "Faollashtirish"}</button>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {canManage && (
        <button type="button" className="delete-team" disabled={busy} onClick={deleteTeam}>
          <span aria-hidden="true">×</span><div><strong>Jamoani o‘chirish</strong><small>Jamoa ro‘yxatidan olib tashlash</small></div><b>›</b>
        </button>
      )}

      {showDistribution && team.type === "washer" && (
        <WasherPriceDistributionModal
          members={activeMembers}
          onClose={() => !savingDistribution && setShowDistribution(false)}
          onSave={saveWasherDistribution}
          saving={savingDistribution}
        />
      )}
    </main>
  );
}
