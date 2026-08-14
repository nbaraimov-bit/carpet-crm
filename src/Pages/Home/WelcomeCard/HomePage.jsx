import "./HomePage.css"
import SakuraPetals from "./SakuraPetals";
import AnimatedCarpet from "./AnimatedCarpet";
import logo from "../Assets/logo.png"
import OperatorIcon from "../Assets/operatorIcon.png"

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

      <div className="app-container">

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
      <div className="role-icon driver-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M7 38V27C7 24.8 8.8 23 11 23H42L50 31H55C56.7 31 58 32.3 58 34V44H7V38Z"
            fill="currentColor"
            opacity=".9"
          />

          <path
            d="M42 23V31H50"
            stroke="white"
            strokeWidth="2"
            opacity=".7"
          />

          <circle
            cx="18"
            cy="45"
            r="6"
            fill="#10162f"
            stroke="currentColor"
            strokeWidth="3"
          />

          <circle
            cx="48"
            cy="45"
            r="6"
            fill="#10162f"
            stroke="currentColor"
            strokeWidth="3"
          />

          <path
            d="M11 35H37"
            stroke="white"
            strokeWidth="2"
            opacity=".5"
          />
        </svg>
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
      <div className="role-icon washer-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M12 35C12 28 17 23 24 23H48C52 23 55 26 55 30V39C55 44 51 48 46 48H20C15 48 12 43 12 35Z"
            fill="currentColor"
            opacity=".9"
          />

          <path
            d="M18 27C20 22 24 19 29 19"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".7"
          />

          <circle
            cx="42"
            cy="17"
            r="5"
            fill="currentColor"
            opacity=".7"
          />

          <circle
            cx="51"
            cy="11"
            r="3"
            fill="currentColor"
            opacity=".5"
          />

          <path
            d="M19 39C24 42 31 43 39 42"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
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
      <div className="role-icon packing-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M10 20L32 10L54 20L32 30L10 20Z"
            fill="currentColor"
            opacity=".95"
          />

          <path
            d="M10 20V45L32 55V30L10 20Z"
            fill="currentColor"
            opacity=".7"
          />

          <path
            d="M54 20V45L32 55V30L54 20Z"
            fill="currentColor"
            opacity=".5"
          />

          <path
            d="M32 10V30"
            stroke="white"
            strokeWidth="2"
            opacity=".7"
          />

          <path
            d="M22 15L44 25"
            stroke="white"
            strokeWidth="2"
            opacity=".4"
          />
        </svg>
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
        <div className="role-icon admin-icon">
          <svg viewBox="0 0 64 64" fill="none">
            <path
              d="M32 8L52 16V30C52 43 43 52 32 56C21 52 12 43 12 30V16L32 8Z"
              fill="currentColor"
              opacity=".85"
            />

            <path
              d="M23 32L29 38L42 24"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
        <div className="role-icon owner-icon">
          <svg viewBox="0 0 64 64" fill="none">
            <path
              d="M10 46L15 24L25 34L32 16L39 34L49 24L54 46H10Z"
              fill="currentColor"
              opacity=".9"
            />

            <path
              d="M10 49H54"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <circle cx="32" cy="12" r="3" fill="white" />
          </svg>
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
</div>

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

    </>

  )
      
}