import MainInfoCard from "../MainInfoCard/MainInfoCard";
import SakuraPetals from "./SakuraPetals";
import RoleCard from "../RoleCard/RoleCard";
import WelcomeCard from "../WelcomeCard/WelcomeCard"

export default function HomePage({

  currentWorker,
  setRole,
  washerTeam,
  driverTeam,
  packingTeam,

}) {

  return (

    <>

      <SakuraPetals />
        
      <WelcomeCard
        currentWorker={currentWorker}
      />

      <RoleCard
        currentWorker={currentWorker}
        setRole={setRole}
        washerTeam={washerTeam}
        driverTeam={driverTeam}
        packingTeam={packingTeam}
      />

      <MainInfoCard/>

    </>

  )
      
}
