import { useEffect, useRef, useState } from "react";
import { collection, doc, onSnapshot, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import { BackIcon } from "../Sakura/MainIcons/SvgIcons";

export default function AdminPanel({ setRole }) {
  const [workerRequests, setWorkerRequests] = useState([]);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const inFlight = useRef(new Set());

  useEffect(() => onSnapshot(
    collection(db, "workerRequests"),
    (snapshot) => setWorkerRequests(snapshot.docs.map((requestDoc) => ({
      firebaseId: requestDoc.id,
      ...requestDoc.data(),
    }))),
    (snapshotError) => setError(snapshotError.message || "So'rovlarni yuklashda xatolik yuz berdi."),
  ), []);

  const runRequestAction = async (request, action) => {
    const requestId = request.firebaseId;
    if (!requestId || inFlight.current.has(requestId)) return;
    inFlight.current.add(requestId);
    setProcessingId(requestId);
    setError("");
    try {
      const requestRef = doc(db, "workerRequests", requestId);
      if (action === "approve") {
        const workerRef = doc(collection(db, "workers"));
        await runTransaction(db, async (transaction) => {
          const requestSnapshot = await transaction.get(requestRef);
          if (!requestSnapshot.exists() || requestSnapshot.data().status !== "pending") return;
          const latestRequest = requestSnapshot.data();
          transaction.set(workerRef, {
            name: latestRequest.name,
            phone: latestRequest.phone,
            telegramId: latestRequest.telegramId,
            role: "worker",
            approved: true,
          });
          transaction.update(requestRef, { status: "approved" });
        });
      } else {
        await runTransaction(db, async (transaction) => {
          const requestSnapshot = await transaction.get(requestRef);
          if (!requestSnapshot.exists() || requestSnapshot.data().status !== "pending") return;
          transaction.update(requestRef, { status: "rejected" });
        });
      }
    } catch (actionError) {
      setError(actionError.message || "So'rovni yangilashda xatolik yuz berdi.");
    } finally {
      inFlight.current.delete(requestId);
      setProcessingId("");
    }
  };

  const requests = workerRequests.filter((request) => request.status === "pending");

  return (
    <main className="admin-approval-page role-management-page">
      <button type="button" className="role-back-button" onClick={() => setRole?.("")} aria-label="Orqaga">
        <BackIcon />
      </button>
      <h1>Yangi ishchini tasdiqlash</h1>
      {error && <p role="alert">{error}</p>}
      {requests.length === 0 ? (
        <p>Yangi so'rovlar yo'q.</p>
      ) : requests.map((request) => (
        <article key={request.firebaseId} className="admin-approval-card">
          <p><strong>Ism:</strong> {request.name}</p>
          <p><strong>Telefon:</strong> {request.phone}</p>
          <div className="admin-request-actions">
            <button
              type="button"
              className="admin-request-reject"
              disabled={Boolean(processingId)}
              onClick={() => runRequestAction(request, "reject")}
            >
              {processingId === request.firebaseId ? "Saqlanmoqda..." : "Rad etish"}
            </button>
            <button
              type="button"
              className="admin-request-approve"
              disabled={Boolean(processingId)}
              onClick={() => runRequestAction(request, "approve")}
            >
              {processingId === request.firebaseId ? "Saqlanmoqda..." : "Tasdiqlash"}
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}
