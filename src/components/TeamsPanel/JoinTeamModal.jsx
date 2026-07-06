export default function JoinTeamModal({

  setShowJoinTeam,

}) {

  function handleCloseJoinModal() {

    setShowJoinTeam(false)

  }

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >

      <div
        style={{
          width: "90%",
          maxWidth: 380,
          background: "#111827",
          borderRadius: 20,
          padding: 20,
        }}
      >

        <h2>👥 Jamoaga qo'shilish</h2>

        <button
          onClick={handleCloseJoinModal}
        >
          Bekor
        </button>

      </div>

    </div>

  )

}