export default function DriverPanel({

  orders,
  driverMode,
  setDriverMode,
  updateStatus,
  saveDetails,
  setRole,
  carpetCount,
  setCarpetCount,
  kvm,
  setKvm,
  blanket,
  setBlanket,
  yakandoz,
  setYakandoz,
  curtainCount,
  setCurtainCount,
  curtainMeter,
  setCurtainMeter,
  curtainPrice,
  setCurtainPrice,
  other,
  setOther,
  price,
  setPrice,
  driverComment,
  setDriverComment,
  currentWorker,

}) {

  return (

    <div>

        <h1>Driver panel</h1>

        <br /><br />

        {!driverMode && (
          <div>

            <button 
              onClick={() => setRole("")}
              style={{fontSize: 20}}  
            >
              ⏪️
            </button>

            <br /><br />

            <button
              onClick={() => setDriverMode("pickup")}
            >
              Olish
            </button>

            <br /><br />

            <button
              onClick={() => setDriverMode("delivery")}
            >
              Yetkazish
            </button>

          </div>
        )}

        {/* ===== pickup mode ===== */}
        {driverMode === "pickup" && (
          <>

          <button 
            onClick={() => setDriverMode("")}
            style={{fontSize: 20}}
          >
            ⏪️
          </button>

          <hr />

          <h2>Yangi buyurtmalar</h2>

          {orders
            .filter((o) => o.status === "Yangi")
            .map((order) => (
              <div
                key={order.id}
                style={{
                  border: order.tarif === "tezkor" ? "3px solid red" : "3px solid green",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <p><b>Telefon:</b> {order.phone}</p>
                <p><b>Manzil:</b> {order.address}</p>
                <p><b>Mijoz ID:</b> {order.customerId}</p>
                <p><b>Buyurtma ID:</b> {order.id}</p>
                <p><b>Tarif:</b>{" "}{order.tarif}</p>
                {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
                

                <button
                  onClick={() =>
                    updateStatus(order.firebaseId, "Olinmoqda")
                  }
                >
                  Men olaman
                </button>
              </div>
            ))
          }

          <h2>Mening buyurtmalarim</h2>

          {orders
            .filter( (o) =>
              o.status === "Olinmoqda" &&
              o.assignedDriver === currentWorker?.phone
            )
            .map((order) => (
              <div
                key={order.id}
                style={{
                  border: order.tarif === "tezkor" ? "3px solid red" : "3px solid blue",
                  padding: 10,
                  marginBottom: 10,
                }}  
              >
                <p><b>Telefon:</b> {order.phone}</p>
                <p><b>Manzil:</b> {order.address}</p>
                <p><b>Buyurtma ID:</b> {order.id}</p>
                <p><b>Tarif:</b>{" "}{order.tarif}</p>
                <p><b>Status:</b> {order.status}</p>
                {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
                
                <details>
                  <summary>
                    ma'lumotlarni kiritish
                  </summary>
                
                <div style={{ marginTop: 10 }}>

                  <input
                    placeholder="Gilam soni"
                    value={carpetCount}
                    onChange={(e) =>
                      setCarpetCount(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Kv.m"
                    value={kvm}
                    onChange={(e) =>
                      setKvm(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Adyol"
                    value={blanket}
                    onChange={(e) =>
                      setBlanket(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Yakandoz"
                    value={yakandoz}
                    onChange={(e) =>
                      setYakandoz(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Parda soni"
                    value={curtainCount}
                    onChange={(e) =>
                      setCurtainCount(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Parda metri"
                    value={curtainMeter}
                    onChange={(e) =>
                      setCurtainMeter(e.target.value)
                    }  
                  />

                  <br /><br />

                  <input
                    placeholder="Parda narxi"
                    value={curtainPrice}
                    onChange={(e) =>
                      setCurtainPrice(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Boshqa"
                    value={other}
                    onChange={(e) =>
                      setOther(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="izoh"
                    value={driverComment}
                    onChange={(e) =>
                      setDriverComment(e.target.value)
                    }
                  />

                  <br /><br />

                  <input
                    placeholder="Jami narx"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />

                  <br /><br />

                  <button
                    onClick={async () => {
                      await saveDetails(order.firebaseId)

                      await updateStatus(
                        order.firebaseId,
                        "Olindi"
                      )
                    }}
                  >
                    Olindi
                  </button>

                </div>
                </details>

              </div>
            ))
          }
        </>)}

        {/* ===== delivery mode ===== */}
        {driverMode === "delivery" && (
        <>
          <button 
            onClick={() => setDriverMode("")}
            style={{fontSize: 20}}  
          >
            ⏪️
          </button>

          <hr />

          <h2>Yetkazilmoqda</h2>

          {orders
            .filter((o) => o.status === "Yetkazilmoqda")
            .map((order) => (
              <div
                key={order.id}
                style={{
                  border: order.tarif === "tezkor" ? "3px solid red" : "3px solid green",
                  padding: 10,
                  marginBottom: 10,
                }}
              >

                <p><b>Buyurtma ID:</b> {order.id}</p>
                <p><b>Telefon:</b> {order.phone}</p>
                <p><b>Manzil:</b> {order.address}</p>
                <details>
                  <summary>
                    batafsil
                  </summary>
                  {order.carpetCount && (<p><b>Gilam:</b> {order.carpetCount}</p>)}
                  {order.kvm && (<p><b>Kv.m:</b> {order.kvm}</p>)}
                  {order.blanket && (<p><b>Adyol:</b> {order.blanket}</p>)}
                  {order.yakandoz && (<p><b>Yakandoz:</b> {order.yakandoz}</p>)}
                  {order.curtainCount && (<p><b>Parda:</b> {order.curtainCount}</p>)}
                  {order.curtainMeter && (<p><b>Parda metri:</b> {order.curtainMeter}</p>)}
                  {order.other && (<p><b>Boshqa:</b> {order.other}</p>)}
                  <p><b>Tarif:</b>{" "}{order.tarif}</p>
                  {order.price && (<p><b>Jami narx:</b> {order.price}</p>)}
                  <p><b>Status:</b> {order.status}</p>
                  {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
                  {order.driverComment&&(<p><b>izoh:</b>{" "}{order.driverComment}</p>)}
                </details>
 
                <button
                  onClick={() =>
                    updateStatus(
                      order.firebaseId,
                      "Yetkazildi"
                    )
                  }
                  style={{
                    padding: 3,
                    marginRight: 10,
                    marginTop: 20,
                    background: "green",
                    color: "white",
                  }}
                >
                  Yetkazildi
                </button>
              </div>
            ))
          }
 
          <h2>Tayyor buyurtmalar</h2>
      
          {orders
            .filter((o) => o.status === "Tayyor")
            .map((order) => (
              <div
                key={order.id}
                style={{
                  border: order.tarif === "tezkor" ? "3px solid red" : "3px solid blue",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <p><b>Buyurtma ID:</b> {order.id}</p>
                <p><b>Telefon:</b> {order.phone}</p>
                <p><b>Manzil:</b> {order.address}</p>
                <details>
                  <summary>
                    batafsil
                  </summary>
                  {order.carpetCount && (<p><b>Gilam:</b> {order.carpetCount}</p>)}
                  {order.kvm && (<p><b>Kv.m:</b> {order.kvm}</p>)}
                  {order.blanket && (<p><b>Adyol:</b> {order.blanket}</p>)}
                  {order.yakandoz && (<p><b>Yakandoz:</b> {order.yakandoz}</p>)}
                  {order.curtainCount && (<p><b>Parda:</b> {order.curtainCount}</p>)}
                  {order.curtainMeter && (<p><b>Parda metri:</b> {order.curtainMeter}</p>)}
                  {order.other && (<p><b>Boshqa:</b> {order.other}</p>)}
                  <p><b>Tarif:</b>{" "}{order.tarif}</p>
                  {order.price && (<p><b>Jami narx:</b> {order.price}</p>)}
                  <p><b>Status:</b> {order.status}</p>
                  {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
                  {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}
                </details>
                <button
                  onClick={() =>
                    updateStatus(
                      order.firebaseId,
                      "Yetkazilmoqda"
                    )
                  }
                   style={{
                    padding: 3,
                    marginRight: 10,
                    marginTop: 20,
                    background: "blue",
                    color: "white",
                  }}
                >
                  Men yetkazaman
                </button>
              </div>
            ))
          }

        </> )} 

 
      </div>

  )

}