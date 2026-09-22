import { db } from "../../../firebase";
import { useState, useEffect } from "react"
import {
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function ArchivePage({ }) {

  const [archiveSearch, setArchiveSearch] = useState("");
  const [archives, setArchives] = useState([])

    useEffect(() => {
  
      const unsubscribe = onSnapshot(
        collection(
          db,
          "archives"
        ),
  
        (snapshot) => {
          setArchives(
            snapshot.docs.map(
              (doc) => ({
                firebaseId: doc.id, ...doc.data(),
              })
            )
          )
        }
      )
  
      return () => unsubscribe()
  
    }, [])

  // ===== MIJOZLAR BO'YICHA GURUHLASH =====

  const groupedArchives = {};

  archives.forEach((order) => {

    if (!order.customerId) return;

    if (!groupedArchives[order.customerId]) {
      groupedArchives[order.customerId] = [];
    }

    groupedArchives[order.customerId].push(order);
  });


  return (
    <div
      style={{
        padding: 20,
        color: "white",
      }}
    >


      <h1>Arxiv</h1>


      {/* ===== QIDIRUV ===== */}

      <input
        type="text"
        placeholder="Qidirish"
        value={archiveSearch}
        onChange={(e) => setArchiveSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          boxSizing: "border-box",
          marginTop: 10,
          marginBottom: 20,
        }}
      />


      {/* ===== MIJOZLAR ===== */}

      {Object.entries(groupedArchives)

        .filter(([customerId, orders]) => {

  const text = archiveSearch.toLowerCase().trim();

  if (!text) return true;

  return (
    customerId.toLowerCase().includes(text) ||

    // Telefon
    String(orders[0]?.phone || "")
      .toLowerCase()
      .includes(text) ||

    // Buyurtmaning barcha ma'lumotlari
    orders.some((order) =>
      Object.values(order).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(text)
      )
    )
  );
})

        .sort(([a], [b]) => {

          return (
            Number(a.replace("C", "")) -
            Number(b.replace("C", ""))
          );

        })

        .map(([customerId, orders]) => (

          <div
            key={customerId}
            style={{
              border: "3px solid #ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 10,
            }}
          >

            <p>
              <b>Mijoz ID:</b> {customerId}
            </p>

            <p>
              <b>Telefon:</b> {orders[0]?.phone || "-"}
            </p>

            <p>
              <b>Buyurtma soni:</b> {orders.length}
            </p>


            {/* ===== BATAFSIL ===== */}

            <details>

              <summary>
                Batafsil
              </summary>


              {orders.map((order) => (

                <div
                  key={order.firebaseId || order.id}
                  style={{
                    border: "1px solid #aaa",
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                >

                  <p>
                    <b>Sana:</b>{" "}
                    {order.createdAt?.toDate
                      ? order.createdAt
                          .toDate()
                          .toLocaleDateString("uz-UZ")
                      : "-"
                    }
                  </p>


                  <p>
                    <b>Buyurtma ID:</b>{" "}
                    {order.id || "-"}
                  </p>


                  <p>
                    <b>Manzil:</b>{" "}
                    {order.address || "-"}
                  </p>


                  {order.carpetCount && (
                    <p>
                      <b>Gilam:</b>{" "}
                      {order.carpetCount}
                    </p>
                  )}


                  {order.kvm && (
                    <p>
                      <b>Kv.m:</b>{" "}
                      {order.kvm}
                    </p>
                  )}


                  {order.blanketCount && (
                    <p>
                      <b>Adyol:</b>{" "}
                      {order.blanketCount}
                    </p>
                  )}
                  {order.yakandozCount && (
                    <p>
                      <b>Yakandoz:</b>{" "}
                      {order.yakandozCount}
                    </p>
                  )}


                  {order.curtainCount && (
                    <p>
                      <b>Parda:</b>{" "}
                      {order.curtainCount}
                    </p>
                  )}


                  {order.curtainMeter && (
                    <p>
                      <b>Parda metri:</b>{" "}
                      {order.curtainMeter}
                    </p>
                  )}


                  {order.other && (
                    <p>
                      <b>Boshqa:</b>{" "}
                      {order.other}
                    </p>
                  )}


                  <p>
                    <b>Tarif:</b>{" "}
                    {order.tarif || "-"}
                  </p>


                  {order.price && (
                    <p>
                      <b>Jami narx:</b>{" "}
                      {order.price}
                    </p>
                  )}


                  <p>
                    <b>Status:</b>{" "}
                    {order.status || "-"}
                  </p>

                </div>

              ))}

            </details>

          </div>

        ))}

    </div>
  );
}