import { useRef, useState } from "react";

export default function AdminPanel({ workerRequests = [], approveWorker }) {
  const [approvingId, setApprovingId] = useState("");
  const [error, setError] = useState("");
  const inFlight = useRef(new Set());
  const requests = workerRequests.filter((request) => request.status === "pending");

  const approve = async (request) => {
    if (inFlight.current.has(request.firebaseId)) return;
    inFlight.current.add(request.firebaseId);
    setApprovingId(request.firebaseId);
    setError("");
    try {
      await approveWorker(request);
    } catch (approvalError) {
      setError(approvalError.message || "Ishchini tasdiqlashda xatolik yuz berdi.");
    } finally {
      inFlight.current.delete(request.firebaseId);
      setApprovingId("");
    }
  };

  return (
    <main className="admin-approval-page">
      <h1>Yangi ishchini tasdiqlash</h1>
      {error && <p role="alert">{error}</p>}
      {requests.length === 0 ? (
        <p>Yangi so'rovlar yo'q.</p>
      ) : requests.map((request) => (
        <article key={request.firebaseId} className="admin-approval-card">
          <p><strong>Ism:</strong> {request.name}</p>
          <p><strong>Telefon:</strong> {request.phone}</p>
          <button
            type="button"
            disabled={Boolean(approvingId)}
            onClick={() => approve(request)}
          >
            {approvingId === request.firebaseId ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
          </button>
        </article>
      ))}
    </main>
  );
}
