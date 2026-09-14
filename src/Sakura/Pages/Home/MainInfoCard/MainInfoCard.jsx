import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";

import "./MainInfoCard.css";

import YangiIcon from "../Assets/yangiIcon.png";
import OlindiIcon from "../Assets/olindiIcon.png";
import YuvildiIcon from "../Assets/yuvildiIcon.png";
import TayyorIcon from "../Assets/tayyorIcon.png";

import CarpetIcon from "../Assets/carpetIcon.png";
import BlanketIcon from "../Assets/blanketIcon.png";
import YakandozIcon from "../Assets/yakandozIcon.png";
import CurtainIcon from "../Assets/curtainIcon.png";

export default function MainInfoCard() {

  const [stats, setStats] = useState({
    yangi: {
      orders: 0,
      carpet: 0,
      blanket: 0,
      yakandoz: 0,
      curtain: 0,
    },
    olindi: {
      orders: 0,
      carpet: 0,
      blanket: 0,
      yakandoz: 0,
      curtain: 0,
    },
    yuvildi: {
      orders: 0,
      carpet: 0,
      blanket: 0,
      yakandoz: 0,
      curtain: 0,
    },
    tayyor: {
      orders: 0,
      carpet: 0,
      blanket: 0,
      yakandoz: 0,
      curtain: 0,
    },
  });

  useEffect(() => {

    const loadStats = async () => {

      const snapshot = await getDocs(
        collection(db, "orders")
      );

      const result = {
        yangi: {
          orders: 0,
          carpet: 0,
          blanket: 0,
          yakandoz: 0,
          curtain: 0,
        },
        olindi: {
          orders: 0,
          carpet: 0,
          blanket: 0,
          yakandoz: 0,
          curtain: 0,
        },
        yuvildi: {
          orders: 0,
          carpet: 0,
          blanket: 0,
          yakandoz: 0,
          curtain: 0,
        },
        tayyor: {
          orders: 0,
          carpet: 0,
          blanket: 0,
          yakandoz: 0,
          curtain: 0,
        },
      };

      snapshot.forEach((doc) => {

        const data = doc.data();
        const status = data.status || "";

        let group = null;

        if (
          status === "Yangi" ||
          status === "Olinmoqda"
        ) {
          group = "yangi";

        } else if (
          status === "Olindi" ||
          status === "Yuvilmoqda"
        ) {
          group = "olindi";

        } else if (
          status === "Yuvildi"
        ) {
          group = "yuvildi";

        } else if (
          status === "Tayyor" ||
          status === "Yetkazilmoqda"
        ) {
          group = "tayyor";
        }

        if (!group) return;

        result[group].orders += 1;

        result[group].carpet += Number(
          data.carpetCount || 0
        );

        result[group].blanket += Number(
          data.blanketCount || 0
        );

        result[group].yakandoz += Number(
          data.yakandozCount || 0
        );

        result[group].curtain += Number(
          data.curtainCount || 0
        );

      });

      setStats(result);
    };

    loadStats();

  }, []);

  
  const statuses = [
    {
      title: "Yangi",
      icon: YangiIcon,
      orders: stats.yangi.orders,
      products: {
        carpet: stats.yangi.carpet,
        blanket: stats.yangi.blanket,
        yakandoz: stats.yangi.yakandoz,
        curtain: stats.yangi.curtain,
      },
    },

    {
      title: "Olindi",
      icon: OlindiIcon,
      orders: stats.olindi.orders,
      products: {
        carpet: stats.olindi.carpet,
        blanket: stats.olindi.blanket,
        yakandoz: stats.olindi.yakandoz,
        curtain: stats.olindi.curtain,
      },
    },
    
    {
      title: "Yuvildi",
      icon: YuvildiIcon,
      orders: stats.yuvildi.orders,
      products: {
        carpet: stats.yuvildi.carpet,
        blanket: stats.yuvildi.blanket,
        yakandoz: stats.yuvildi.yakandoz,
        curtain: stats.yuvildi.curtain,
      },
    },

    {
      title: "Tayyor",
      icon: TayyorIcon,
      orders: stats.tayyor.orders,
      products: {
        carpet: stats.tayyor.carpet,
        blanket: stats.tayyor.blanket,
        yakandoz: stats.tayyor.yakandoz,
        curtain: stats.tayyor.curtain,
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
          <strong>
            {stats.yangi.orders +
            stats.olindi.orders +
            stats.yuvildi.orders +
            stats.tayyor.orders}
          </strong>
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

                <strong>
                  {status.orders}
                </strong>

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