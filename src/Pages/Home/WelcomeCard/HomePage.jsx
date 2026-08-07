import "./HomePage.css"
import SakuraPetals from "../SakuraPetals";
import AnimatedCarpet from "./AnimatedCarpet";

export default function HomePage({

  currentWorker,
  setRole,
  currentPhone,
  washerTeam,
  driverTeam,
  packingTeam,
  operatorTeam,
  logout,

}) {

  const washerMember = washerTeam?.members?.[currentPhone];
  const driverMember = driverTeam?.members?.[currentPhone];
  const packingMember = packingTeam?.members?.[currentPhone];
  const operatorMember = operatorTeam?.members?.[currentPhone];
  const operatorEnabled = !!operatorTeam && operatorMember?.working;
  const driverEnabled = !!driverTeam && driverMember?.working;
  const washerEnabled = !!washerTeam && washerMember?.working;
  const packingEnabled = !!packingTeam && packingMember?.working;

  return (

    <>

      <SakuraPetals />
      
      <div className="app-container">
        
        <div className="home-hero">

          <div className="home-top">

            <div className="home-brand">

              <img
                src="/logo.png"
                className="home-logo"
                alt="logo"
              />

              <div>

                <div className="home-title">
                  SAKURA
                </div>

                <div className="home-version">
                  Cleaning
                </div>

              </div>

            </div>

          </div>

          <div className="hero-content">

            <div className="hero-text">

              <div className="home-greeting">
                Xush kelibsiz! 👋
              </div>

              <div className="home-worker">
                {currentWorker?.name}
              </div>

              <div className="home-subtitle">
                O'z ish joyingizni tanlang
              </div>

            </div>

          </div>

          <AnimatedCarpet/>

        </div>

        <div className="roles-grid">  
    
          <div
            className="role-card"
            onClick={() => setRole("operator")}
          >
            <div style={{ fontSize: 42 }}>
              🎧
            </div>

            <div className="role-title">
              Operator
            </div>

            <div className="role-subtitle">
              Buyurtmalarni qabul qilish va boshqarish
            </div>
          </div>

          <div
            className={`role-card ${driverEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (driverEnabled) {setRole("driver");}
            }}
          >
            <div style={{ fontSize: 42 }}>
              🚚
            </div>

            <div className="role-title">
              Driver
            </div>

            <div className="role-subtitle">
              Buyurtmalarni yetkazish va statusni yangilash
            </div>
          </div>

          <div
            className={`role-card ${washerEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (washerEnabled) {setRole("washer");}
            }}
          >
            <div style={{ fontSize: 42 }}>
              🧼
            </div>

            <div className="role-title">
              Washer
            </div>

            <div className="role-subtitle">
              Gilamlarni yuvish va holatini belgilash
            </div>
          </div>

          <div
            className={`role-card ${packingEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (packingEnabled) {setRole("tayyorlovchi");}
            }}
          >
            <div style={{ fontSize: 42 }}>
              📦
            </div>

            <div className="role-title">
              Tayyorlovchi
            </div>

            <div className="role-subtitle">
              Gilamlarni tayyorlash va qadoqlash
            </div>
          </div>

        {(currentWorker?.role === "admin"
          || currentWorker?.role === "ega"
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("admin")}
          >
            <div style={{ fontSize: 42 }}>
              🛡️
            </div>

            <div className="role-title">
              Admin
            </div>

            <div className="role-subtitle">
              Tizimni boshqarish va nazorat qilish
            </div>
          </div>
        )}

        {currentWorker?.role === "ega" && (
          <div
            className="role-card"
            onClick={() => setRole("ega")}
          >
            <div style={{ fontSize: 42 }}>
              👑
            </div>

            <div className="role-title">
              Ega
            </div>

            <div className="role-subtitle">
              Umumiy nazorat va tahlillar
            </div>
          </div>
        )}

        <br /><br />

        <hr />
        
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 5,
            border: "3px solid #ff0000",

           }}
        >
          <button onClick={logout}>
            Chiqish
          </button>
        </div> 

        </div>
      </div>

    </>

  )
      
}