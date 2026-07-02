

export default function TeamsPanel({
  teams,
  setTeams,
  role,
  currentWorker,
  workers,
  setPage,
}) {
    
  const myTeams = teams.filter((team) => {
    return team.members?.[currentWorker.phone];
  });

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setPage("home")}>
        ⏪
      </button>

      <h2>Jamoalar</h2>

      <p>Bu yerda barcha jamoalar chiqadi.</p>

      {myTeams.map((team) => (
        <div
          key={team.teamId}
          style={{
            border: "1px solid #555",
            borderRadius: 10,
            padding: 10,
            marginTop: 10,
          }}
        >
          <b>{team.teamName}</b>

          <p>{team.type}</p>

          <p>{team.leader}</p>
        </div>
      ))}
    </div>
  )
}