import "./HomePage.css"
import MainInfoCard from "./MainInfoCard";
import SakuraPetals from "./SakuraPetals";
import AnimatedCarpet from "./AnimatedCarpet";
import logo from "../Assets/logo.png"
import OperatorIcon from "../Assets/operatorIcon.png"
import DriverIcon from "../Assets/driverIcon.png"
import WasherIcon from "../Assets/washerIcon.png"
import PackingIcon from "../Assets/packingIcon.png"
import AdminIcon from "../Assets/adminIcon.png"
import EgaIcon from "../Assets/egaIcon.png"

export default function HomePage({

  currentWorker,
  setRole,
  currentPhone,
  washerTeam,
  driverTeam,
  packingTeam,
  operatorTeam,

}) {

  const washerMember = washerTeam?.members?.[currentPhone];
  const driverMember = driverTeam?.members?.[currentPhone];
  const packingMember = packingTeam?.members?.[currentPhone];
  const operatorMember = operatorTeam?.members?.[currentPhone];
  const operatorEnabled = !!operatorTeam
  const driverEnabled = !!driverTeam
  const washerEnabled = !!washerTeam
  const packingEnabled = !!packingTeam

  return (

    <>

      <SakuraPetals />
        
      <div className="home-hero">

        <div className="home-top">

          <div className="home-brand">

            <img
              src={logo}
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

          {/* OPERATOR */}
          <div
            className="role-card"
            onClick={() => setRole("operator")}
          >
            <div className="role-icon-wrap">
              <img
                src={OperatorIcon}
                className="role-icon"
                alt="Operator"
              />
            </div>

            <div className="role-content">
              <div className="role-title">
                Operator
              </div>

              <div className="role-subtitle">
                Buyurtmalarni qabul qilish va boshqarish
              </div>
            </div>

            <div className="role-arrow">›</div>
          </div>


          {/* DRIVER */}
          <div
            className={`role-card ${driverEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (driverEnabled) {
                setRole("driver");
              }
            }}
          >
            <div className="role-icon-wrap">
              <img
                src={DriverIcon}
                className="role-icon"
                alt="Driver"
              />
            </div>

            <div className="role-content">
              <div className="role-title">
                Driver
              </div>

              <div className="role-subtitle">
                Buyurtmalarni yetkazish va statusni yangilash
              </div>
            </div>

            <div className="role-arrow">›</div>
          </div>


          {/* WASHER */}
          <div
            className={`role-card ${washerEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (washerEnabled) {
                setRole("washer");
              }
            }}
          >
            <div className="role-icon-wrap">
              <img
                src={WasherIcon}
                className="role-icon"
                alt="Washer"
              />
            </div>

            <div className="role-content">
              <div className="role-title">
                Washer
              </div>

              <div className="role-subtitle">
                Gilamlarni yuvish va holatini belgilash
              </div>
            </div>

            <div className="role-arrow">›</div>
          </div>


          {/* TAYYORLOVCHI */}
          <div
            className={`role-card ${packingEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (packingEnabled) {
                setRole("tayyorlovchi");
              }
            }}
          >
            <div className="role-icon-wrap">
              <img
                src={PackingIcon}
                className="role-icon"
                alt="Packing"
              />
            </div>

            <div className="role-content">
              <div className="role-title">
                Tayyorlovchi
              </div>  

              <div className="role-subtitle">
                Gilamlarni tayyorlash va qadoqlash
              </div>
            </div> 

            <div className="role-arrow">›</div>
          </div>


          {/* ADMIN */}
          {(currentWorker?.role === "admin" ||
            currentWorker?.role === "ega") && (
            <div
              className="role-card"
              onClick={() => setRole("admin")}
            >
              <div className="role-icon-wrap">
                <img
                  src={AdminIcon}
                  className="role-icon"
                  alt="Admin"
                />
              </div>

              <div className="role-content">
                <div className="role-title">
                  Admin
                </div>

                <div className="role-subtitle">
                  Tizimni boshqarish va nazorat qilish
                </div>
              </div>

              <div className="role-arrow">›</div>
            </div>
          )}


          {/* EGA */}
          {currentWorker?.role === "ega" && (
            <div
              className="role-card"
              onClick={() => setRole("ega")}
            >
              <div className="role-icon-wrap">
                <img
                  src={EgaIcon}
                  className="role-icon"
                  alt="Ega"
                />
              </div>

              <div className="role-content">
                <div className="role-title">
                  Ega
                </div>
 
                <div className="role-subtitle">
                  Umumiy nazorat va tahlillar
                </div>
              </div> 

              <div className="role-arrow">›</div>
            </div>
          )}

        </div>

        <MainInfoCard/>

    </>

  )
      
}