import "./MainInfoCard.css";
import NewIcon from "../Assets/newIcon.png";
import OlindiIcon from "../Assets/olindiIcon.png";
import YuvildiIcon from "../Assets/yuvildiIcon.png";
import TayyorIcon from "../Assets/tayyorIcon.png";
import CarpetIcon from "../Assets/carpetIcon.png";
import BlanketIcon from "../Assets/blanketIcon.png";
import YakandozIcon from "../Assets/yakandozIcon.png";
import PardaIcon from "../Assets/pardaIcon.png";


export default function MainInfoCard() {
  return (
    <section className="main-info-card">

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

      {/* 4 ta holat */}
      <div className="main-info-status">

        {/* YANGI */}
        <div className="info-status-item">

          <div className="info-status-main">
            <NewIcon size={23} />

            <div>
              <div className="info-status-title">Yangi</div>
              <strong>12</strong>
            </div>

          </div>

          <div className="info-products">

            <div className="info-product">
              <CarpetIcon size={21} />
              <span>18</span>
            </div>

            <div className="info-product">
              <BlanketIcon size={21} />
              <span>6</span>
            </div>

            <div className="info-product">
              <YakandozIcon size={21} />
              <span>2</span>
            </div>

            <div className="info-product">
              <CurtainIcon size={21} />
              <span>1</span>
            </div>

          </div>

        </div>


        {/* OLINди */}
        <div className="info-status-item">

          <div className="info-status-main">
            <OlindiIcon size={23} />

            <div>
              <div className="info-status-title">Olindi</div>
              <strong>8</strong>
            </div>

          </div>

          <div className="info-products">

            <div className="info-product">
              <CarpetIcon size={21} />
              <span>12</span>
            </div>

            <div className="info-product">
              <BlanketIcon size={21} />
              <span>3</span>
            </div>

            <div className="info-product">
              <YakandozIcon size={21} />
              <span>2</span>
            </div>

            <div className="info-product">
              <CurtainIcon size={21} />
              <span>1</span>
            </div>

          </div>

        </div>


        {/* YUVILDI */}
        <div className="info-status-item">

          <div className="info-status-main">
            <YuvildiIcon size={23} />

            <div>
              <div className="info-status-title">Yuvildi</div>
              <strong>5</strong>
            </div>

          </div>

          <div className="info-products">

            <div className="info-product">
              <CarpetIcon size={21} />
              <span>8</span>
            </div>

            <div className="info-product">
              <BlanketIcon size={21} />
              <span>2</span>
            </div>

            <div className="info-product">
              <YakandozIcon size={21} />
              <span>1</span>
            </div>

            <div className="info-product">
              <CurtainIcon size={21} />
              <span>1</span>
            </div>

          </div>

        </div>


        {/* TAYYOR */}
        <div className="info-status-item">

          <div className="info-status-main">
            <TayyorIcon size={23} />

            <div>
              <div className="info-status-title">Tayyor</div>
              <strong>7</strong>
            </div>

          </div>

          <div className="info-products">

            <div className="info-product">
              <CarpetIcon size={21} />
              <span>10</span>
            </div>

            <div className="info-product">
              <BlanketIcon size={21} />
              <span>4</span>
            </div>
            <div className="info-product">
              <YakandozIcon size={21} />
              <span>2</span>
            </div>

            <div className="info-product">
              <CurtainIcon size={21} />
              <span>1</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}