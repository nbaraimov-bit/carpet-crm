import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import teamTypes from "./teamTypes";
import washerIcon from "../../Pages/Home/Assets/washerIcon.png";
import packingIcon from "../../Pages/Home/Assets/packingIcon.png";
import driverIcon from "../../Pages/Home/Assets/driverIcon.png";

const teamArt = { washer: washerIcon, packing: packingIcon, driver: driverIcon };

export default function CreatePremiumTeamModal({ myTeams, currentWorker, onClose }) {
  const [teamName, setTeamName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const joinedTypes = new Set(myTeams.map((team) => team.type));
  const validName = teamName.trim().length >= 5 && teamName.trim().length <= 20;

  const createTeam = async () => {
    if (!validName || !selectedType || !currentWorker?.phone || loading) return;
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "pendingTeams"), {
        teamName: teamName.trim(),
        type: selectedType,
        createdBy: currentWorker.phone,
        leaderName: currentWorker.name || "",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (createError) {
      setError(createError.message || "Jamoa so‘rovini yuborib bo‘lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-team-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && !loading && onClose()}>
      <section className="premium-team-modal premium-create-modal" role="dialog" aria-modal="true" aria-labelledby="create-team-title">
        <button type="button" className="premium-team-modal-close" onClick={onClose} disabled={loading} aria-label="Yopish">×</button>
        <p className="premium-teams-eyebrow">YANGI JAMOA</p>
        <h2 id="create-team-title">Jamoa yaratish</h2>
        <label className="premium-create-name">Jamoa nomi
          <input value={teamName} maxLength={20} onChange={(event) => setTeamName(event.target.value)} placeholder="Masalan: Sakura jamoasi" />
        </label>
        <div className="premium-create-types">
          {teamTypes.map((type) => (
            <button type="button" key={type.id} disabled={joinedTypes.has(type.id)} className={selectedType === type.id ? "selected" : ""} onClick={() => setSelectedType(type.id)}>
              <img src={teamArt[type.id]} alt="" />
              <span>{type.title}</span>
              {joinedTypes.has(type.id) && <small>A’ZO</small>}
            </button>
          ))}
        </div>
        {teamName.trim().length > 0 && !validName && <p className="premium-create-hint">Jamoa nomi 5 dan 20 tagacha belgidan iborat bo‘lsin.</p>}
        {error && <p className="premium-create-error" role="alert">{error}</p>}
        <div className="premium-modal-actions">
          <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
          <button type="button" className="premium-modal-save" onClick={createTeam} disabled={!validName || !selectedType || loading}>{loading ? "Yaratilmoqda..." : "So‘rov yuborish"}</button>
        </div>
      </section>
    </div>
  );
}
