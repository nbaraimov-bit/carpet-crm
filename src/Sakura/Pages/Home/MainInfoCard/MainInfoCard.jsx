import "./MainInfoCard.css";
import NewIcon from "../Assets/newIcon.png";
import OlindiIcon from "../Assets/olindiIcon.png";
import YuvildiIcon from "../Assets/yuvildiIcon.png";
import TayyorIcon from "../Assets/tayyorIcon.png";
import CarpetIcon from "../Assets/carpetIcon.png";
import BlanketIcon from "../Assets/blanketIcon.png";
import YakandozIcon from "../Assets/yakandozIcon.png";
import CurtainIcon from "../Assets/curtainIcon.png";


export default function MainInfoCard() {
  return (
<>

      {/* Katta umumiy karta */}
      <div className="main-info-header">
        <div>
          <h3>📊 Buyurtmalar holati</h3>
          <p>Bugungi ko‘rsatkichlar</p>
        </div>

        <div className="main-info-total">
          <strong>32</strong>
          <span>buyurtma</span>
        </div>
      </div>

     </>
  );
}