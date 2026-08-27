import MainInfoCard from "../MainInfoCard/MainInfoCard";
import SakuraPetals from "./SakuraPetals";
import RoleCard from "../RoleCard/RoleCard";
import WelcomeCard from "../WelcomeCard/WelcomeCard"

export default function HomePage({

  currentWorker,
  setRole,
  currentPhone,
  washerTeam,
  driverTeam,
  packingTeam,
  operatorTeam,

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
        currentPhone={currentPhone}
        washerTeam={washerTeam}
        driverTeam={driverTeam}
        packingTeam={packingTeam}
        operatorTeam={operatorTeam}
      />

      <MainInfoCard/>

    </>

  )
      
}