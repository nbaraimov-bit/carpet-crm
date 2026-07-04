export default function CreateTeamModal({
  showCreateTeam,
  setShowCreateModal,
  teamName,
  setTeamName,
  selectedType,
  handleCreateTeam,
  isNameValid,
  teamTypes,
  loading,
  setLoading,
}) {

  const nameLength = teamName.trim().length
  const isNameValid = nameLength >= 5 && nameLength <= 20

  return(

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
        <h2>👥 Jamoa yaratish</h2>

        <p>Jamoa nomi</p>

        <input
          className={
            nameLength === 0
            ? "team-name-input"
            : isNameValid
            ? "team-name-input valid"
            : "team-name-input invalid"
          }
          placeholder="Masalan: fatality"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {nameLength > 0 && nameLength < 5 && (
          <p className="input-error">
            Kamida 5 ta belgi kiriting
          </p>
        )}

        {nameLength > 20 && (
          <p className="input-error">
            Eng ko'pi 20 ta belgi bo'lishi mumkin
          </p> 
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 20,
          }}
        >
          {teamTypes.map((type) => { 

            const disabled = joinedTypes.includes(type.id)  

            return(

              <div
                key={type.id}
                onClick={() => {
                  if(disabled) return
                  setSelectedType(type.id)
                }}

                className={
                  disabled ? "team-type-card disabled"
                  :selectedType === type.id
                  ? "team-type-card active"
                  : "team-type-card"
                }
              >
                <div className="team-content">
                  <div className="team-type-icon">
                    {type.icon}
                  </div>    

                  <div className="team-type-title">
                    {type.title}
                  </div>
                </div> 

                {disabled && (
                  <div className="team-stamp">
                    A'ZO
                  </div>
                )}

              </div>

            )

          })}
        </div>

        <div className="create-team-buttons">

          <button
            className="cancel-button"
            onClick={handleCloseCreateModal}
          >
            Bekor
          </button>

          <button
            className="create-button"
            disabled={
              loading ||
              teamName.trim().length < 5 ||
              teamName.trim().length > 20 ||
              !selectedType
            }
            onClick={handleCreateTeam}
          >
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </button>

        </div>

      </div>
    </div>

  )

}