import "./AnimatedCarpet.css";
import carpet from "./Assets/carpet.png";

export default function AnimatedCarpet(){

    return(

        <div className="carpet-wrapper">

            <div className="carpet-glow"></div>

            <img
                src={carpet}
                alt="carpet"
                className="carpet-image"
            />

            <div className="carpet-shadow"></div>

        </div>

    );

}