import "./WelcomeCard.css"
import AnimatedCarpet from "./AnimatedCarpet";
import logo from "../Assets/logo.png"

export default function WelcomeCard ({
  currentWorker,
}){
  return (

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
  )
}