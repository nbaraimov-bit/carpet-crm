export default function ActiveTeamDetail({

    team,
    currentWorker,
    isAdmin,
    closeTeam,

}) {

    return (

        <div>

            <button onClick={closeTeam}>
                ⬅️
            </button>

            <h2>{team.teamName}</h2>

            Team Detail

        </div>

    )

}