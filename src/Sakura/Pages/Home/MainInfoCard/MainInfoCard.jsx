import "./MainInfoCard.css";

import YangiIcon from "../Assets/YangiIcon.png";
import OlindiIcon from "../Assets/olindiIcon.png";
import YuvildiIcon from "../Assets/yuvildiIcon.png";
import TayyorIcon from "../Assets/tayyorIcon.png";

import CarpetIcon from "../Assets/carpetIcon.png";
import BlanketIcon from "../Assets/blanketIcon.png";
import YakandozIcon from "../Assets/yakandozIcon.png";
import CurtainIcon from "../Assets/curtainIcon.png";

export default function MainInfoCard() {

  const statuses = [
    {
      title: "Yangi",
      icon: YangiIcon,
      orders: 12,
      products: {
        carpet: 18,
        blanket: 6,
        yakandoz: 2,
        curtain: 1,
      },
    },
    {
      title: "Olindi",
      icon: OlindiIcon,
      orders: 8,
      products: {
        carpet: 12,
        blanket: 3,
        yakandoz: 2,
        curtain: 1,
      },
    },
    {
      title: "Yuvildi",
      icon: YuvildiIcon,
      orders: 5,
      products: {
        carpet: 8,
        blanket: 2,
        yakandoz: 1,
        curtain: 1,
      },
    },
    {
      title: "Tayyor",
      icon: TayyorIcon,
      orders: 7,
      products: {
        carpet: 10,
        blanket: 4,
        yakandoz: 2,
        curtain: 1,
      },
    },
  ];

  return (
    <section className="main-info-card">

      {/* ===== HEADER ===== */}

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


      {/* ===== 4 TA STATUS ===== */}

      <div className="main-info-status">

        {statuses.map((status) => (

          <div
            className="info-status-item"
            key={status.title}
          >

            {/* Status icon + nomi + buyurtma soni */}

            <div className="info-status-main">

              <img
                src={status.icon}
                alt={status.title}
                className="info-status-icon"
              />

              <div className="info-status-data">

                <div className="info-status-title">
                  {status.title}
                </div>

                <strong>
                  {status.orders}
                </strong>

              </div>

            </div>


            {/* ===== 2 × 2 MAHSULOTLAR ===== */}

            <div className="info-products">

              <div className="info-product">
                <img src={CarpetIcon} alt="Gilam" />
                <span>{status.products.carpet}</span>
              </div>

              <div className="info-product">
                <img src={BlanketIcon} alt="Adyol" />
                <span>{status.products.blanket}</span>
              </div>

              <div className="info-product">
                <img src={YakandozIcon} alt="Yakandoz" />
                <span>{status.products.yakandoz}</span>
              </div>

              <div className="info-product">
                <img src={CurtainIcon} alt="Parda" />
                <span>{status.products.curtain}</span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}