export default function WasherPanel({

  orders,
  allowedRoles,
  washerMode,
  setWasherMode,
  updateWashStatus,
  currentWorker,
  workers,
  getSalary,
  getHours,
  getCount,
  washerPrices,
  setRole,
  logout,
  todayOpen,
  setTodayOpen,
  weekOpen,
  setWeekOpen,
  MonthOpen,
  setMonthOpen,
  allOpen,
  setAllOpen,
  selectedDate,
  setSelectedDate,
  attendance,
  workerEarnings,
  teams,
  washerTeam, 

}) {  

  const waitingFilter = (service) => (o) =>
  o[`${service}Status`] === "Kutmoqda" &&
  o[`${service}Count`] &&
  !o[`${service}WasherTeamId`];

  const washingFilter = (service) => (o) =>
  o[`${service}Status`] === "Yuvilmoqda" &&
  o[`${service}Count`] &&
  o[`${service}WasherTeamId`] === washerTeam?.id;


  return (
    <>
      {washerMode === "" && (
        <div>
          <h1>Washer panel</h1>

          <hr />

          <br /><br /> 

          {!washerMode && (
          <>

            <button
              onClick={() => setRole("")}
              style={{fontSize: 20}}  
            >
              ⏪️
            </button>

            <br /><br />

            <button
              onClick={() => setWasherMode("carpet")}
            >
              Gilam
            </button>

            <br /><br />

            <button
              onClick={() => setWasherMode("blanket")}
            >
              Adyol
            </button>
 
            <br /><br />

            <button
              onClick={() => setWasherMode("yakandoz")}
            >
              Yakandoz
            </button>

            <br /><br />
  
            <button
              onClick={() => setWasherMode("curtain")}
            >
              Parda
            </button>

            <br /><br />

            {allowedRoles.includes("washer") && 
              !allowedRoles.includes("admin") &&
              !allowedRoles.includes("ega") &&
              (
                <>
                  <button
                    onClick={() => setWasherMode("cabinet")}
                  >
                    Shaxsiy kabinet
                  </button>  
                </>
              )
            }
          </>
          )}
        </div>
      )} 

      {/* ===== gilam paneli ===== */}
      {washerMode === "carpet" && (
      <>
        <br />

        <button
          onClick={() => setWasherMode("")}
          style={{fontSize: 20}}
        >
          ⏪️
        </button>

        <h2>Gilam buyurtmalari</h2>

        {orders.filter(waitingFilter("carpet"))
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
              <p><b>Gilam:</b> {order.carpetCount}</p>
              <p><b>Kv.m:</b> {order.kvm}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.kvm || 0) * washerPrices.carpet}
               </p>

              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "carpetStatus",
                    "Yuvilmoqda"
                  )
                }
              >
                Men yuvaman
              </button>
            </div>
          ))
        }

        <h2>Mening buyurtmalarim</h2>

        {orders.filter(washingFilter("carpet"))
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
              <p><b>Gilam:</b> {order.carpetCount}</p>
              <p><b>Kv.m:</b> {order.kvm}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}
 
              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.kvm || 0) * washerPrices.carpet}
              </p>
 
              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "carpetStatus",
                    "Yuvildi"
                  )
                }
              >
                Yuvildi
              </button>
            </div>
          ))
         }

      </>
      )}

      {/* ===== adyol paneli ===== */}
      {washerMode === "blanket" && (
      <>
        <br />

        <button
          onClick={() => setWasherMode("")}
          style={{fontSize: 20}}
        >
          ⏪️
        </button>

        <h2>Adyol buyurtmalari</h2>

        {orders.filter(waitingFilter("blanket"))
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
              <p><b>Adyol:</b> {order.blanketCount}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.blanketCount || 0) * washerPrices.blanket}
              </p>

              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "blanketStatus",
                    "Yuvilmoqda"
                  )
                }
              >
                Men yuvaman
              </button>
            </div>
          ))}

        <h2>Mening buyurtmalarim</h2>

        {orders.filter(washingFilter("blanket"))
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
              <p><b>Adyol:</b> {order.blanketCount}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.blanketCount || 0) * washerPrices.blanket}
              </p>
 
              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "blanketStatus",
                    "Yuvildi"
                  )
                }
              >
                Yuvildi
              </button>
            </div>
          ))
        }
      </>
      )}

      {/* ===== yakandoz paneli ===== */}
      {washerMode === "yakandoz" && (
      <>
        <br />

        <button
          onClick={() => setWasherMode("")}
          style={{fontSize: 20}}
        >
          ⏪️
        </button>

        <h2>Yakandoz buyurtmalari</h2>

        {orders.filter(waitingFilter("yakandoz"))
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
              {order.yakandozCount && (<p><b>Yakandoz:</b>{" "}{order.yakandozCount}</p>)}
              {order.other && (<p><b>Boshqa:</b> {order.other}</p>)} 
              <p><b>Tarif:</b>{" "}{order.tarif}</p>  
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.yakandozCount || 0) * washerPrices.yakandoz}
              </p>

              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "yakandozStatus",
                    "Yuvilmoqda"
                  )
                }
              >
                Men yuvaman
             </button>
           </div>
          ))
        }

        <h2>Mening buyurtmalarim</h2>
 
          {orders.filter(washingFilter("yakandoz"))
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
              {order.yakandozCount && (<p><b>Yakandoz:</b>{" "}{order.yakandozCount}</p>)}
              {order.other && (<p><b>Boshqa:</b> {order.other}</p>)}
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {Number(order.yakandozCount || 0) * washerPrices.yakandoz}
              </p>   
 
              <button
                onClick={() =>
                  updateWashStatus(
                   order.firebaseId,
                    "yakandozStatus",
                    "Yuvildi"
                  )
                }
              >
                Yuvildi
              </button>
            </div>
          ))
        }
      </>
      )}
      
      {/* ===== parda paneli ===== */}
      {washerMode === "curtain" && (
      <>
        <br />  

        <button
          onClick={() => setWasherMode("")}
          style={{fontStyle: 20}}
        > 
          ⏪️
        </button>    

        <h2>Parda buyurtmalari</h2>
 
        {orders.filter(waitingFilter("curtain"))
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
              <p><b>Parda metri:</b>{" "}{order.curtainMeter}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}

              <p>
                <b>Ish haqi:</b>{" "}
                {
                  Number(order.curtainMeter || 0) *
                  Number(order.curtainPrice || 0) *
                  Number(washerPrices.curtain || 0)
                }
              </p> 
 
              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "curtainStatus",
                    "Yuvilmoqda"
                  )
                }
              >
                Men yuvaman
              </button>
            </div>
          ))
        }

        < h2>Mening buyurtmalarim</h2>
  
        {orders.filter(washingFilter("curtain"))
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
              <p><b>Parda metri:</b>{" "}{order.curtainMeter}</p>
              <p><b>Tarif:</b>{" "}{order.tarif}</p>
              {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
              {order.driverComment&&(<p><b>Izoh:</b>{" "}{order.driverComment}</p>)}
    
              <p>
                <b>Ish haqi:</b>{" "}
                {
                  Number(order.curtainMeter || 0) *
                   Number(order.curtainPrice || 0) *
                  washerPrices.curtain
                }
              </p>

              <button
                onClick={() =>
                  updateWashStatus(
                    order.firebaseId,
                    "curtainStatus",
                    "Yuvildi"
                  )
                }
              >
                Yuvildi
              </button>
            </div>
          ))
        }
      </>
      )}

      {/* ===== washer shaxsiy =====*/}
      {washerMode === "cabinet" && (
        <>

          <button
            onClick={() => {
              const isWorking = workers.find(
                (w) => w.phone === currentWorker?.phone
              )?.working

              if (isWorking) {
                setWasherMode("")
              } else {
                setRole("")
                setWasherMode("")
              }
            }}
            style={{fontSize: 20}}
          >
            ⏪️
          </button>

          <h2>Shaxsiy kabinet</h2>

          <br/>

          <div
            style={{
              marginTop: 10,
              padding: 10,
              border: "3px solid #ccc",
            }}
          >

            <button
              onClick={() =>
                setTodayOpen(!todayOpen)
              }  
            > 
              Bugun
              {todayOpen
                ? " ▲"
                : " ▼"}
            </button>
  
            {todayOpen && (

              <div
                style={{
                   marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >

                {/* ===== ish haqi ===== */}
                <p>
                  Ish haqi:
                  {
                    getSalary( workerEarnings, currentWorker.phone, 7, selectedDate ) 
                    .toLocaleString()
                  }
                  so'm
                </p>
                
                {/* ===== gilam ===== */}
                {
                  getCount(
                    workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 1, selectedDate
                  )> 0 && (
                    <p>
                      Gilam kv.m:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 1, selectedDate
                        )
                      }
                    </p>
                  )
                }
                
                {/* ===== adyol ===== */}
                {
                  getCount(
                    workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 1, selectedDate
                  )> 0 && (
                    <p>
                      Adyol:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 1, selectedDate
                        )
                      }
                    </p>
                  )
                }

                {/* ===== yakandoz ===== */}
                {
                  getCount(
                    workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 1, selectedDate
                  )> 0 && (
                    <p>
                      Yakandoz:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 1, selectedDate
                        )
                      }
                    </p>
                  )
                }
                
                {/* ===== parda ===== */}
                {
                  getCount(
                    orders, currentWorker.phone, "curtainWasher", "curtainMeter", 1, selectedDate
                  )> 0 && (
                    <p>
                      Parda:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", 1, selectedDate
                        )
                      }
                    </p>
                  )
                }

                <p>
                  Ish soati:
                  {
                    getHours(
                      attendance, currentWorker.phone, 1, selectedDate
                    )
                  }
                </p>

              </div>

            )}
          </div>

          {/* ===== washer haftalik ===== */}
          <div 
            style={{
              marginTop: 10,
              padding: 10,
              border: "3px solid #ccc",
            }}
          >

            <button
              onClick={() => setWeekOpen(!weekOpen)} 
            >
              Haftalik
              {weekOpen ? " ▲" : " ▼"}
            </button>  

            {weekOpen && (

              <div
                style={{
                   marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  Ish haqi:
                  {
                    getSalary( workerEarnings, currentWorker.phone, 7, selectedDate )
                    .toLocaleString()
                  }
                  so'm

                </p>

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 7, selectedDate
                  ) > 0 && (
                    <p>
                      Gilam:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 7, selectedDate
                        )
                      }
                    </p>
                  )
                }  

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 7, selectedDate
                  )> 0 && (
                    <p>
                      Adyol:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 7, selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 7, selectedDate
                  )> 0 && (
                    <p>
                      Yakandoz:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 7, selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", 7, selectedDate
                  )> 0 && (
                    <p>
                      Parda:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", 7, selectedDate
                        )
                      }
                    </p>
                  )
                }

                <p>
                  Ish soati:
                  {
                    getHours(
                      attendance, currentWorker.phone, 7, selectedDate
                    )
                  }
                </p>

              </div>
            )} 

          </div>


          {/* washer oylik */}
          <div 
            style={{
              marginTop: 10,
              padding: 10,
              border: "3px solid #ccc",
            }}
          >

            <button
              onClick={() => setMonthOpen(!MonthOpen)} 
            >
              Oylik
              {MonthOpen ? " ▲" : " ▼"}
            </button>  

            {MonthOpen && (
              <div
                style={{
                   marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >

                <p>
                  Ish haqi:
                  {
                    getSalary( workerEarnings, currentWorker.phone, 30, selectedDate )
                    .toLocaleString()
                  }
                  so'm
                </p>

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 30, selectedDate
                  ) > 0 && (
                    <p>
                      Gilam:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "carpetWasher", "kvm", 30, selectedDate
                        )
                      }
                    </p>
                  )
                }  

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 30, selectedDate
                  )> 0 && (
                    <p>
                      Adyol:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "blanketWasher", "blanket", 30, selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 30, selectedDate
                  )> 0 && (
                    <p>
                      Yakandoz:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", 30, selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", 30, selectedDate
                  )> 0 && (
                    <p>
                      Parda:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", 30, selectedDate
                        )
                      }
                    </p>
                  )
                }

                <p>
                  Ish soati:
                  {
                    getHours(
                      attendance, currentWorker.phone, 30, selectedDate
                    )
                  }
                </p>

              </div>
            )} 
          </div>   

          {/* ===== washer jami ===== */}
          <div 
            style={{
              marginTop: 10,
              padding: 10,
              border: "3px solid #ccc",
            }}
          >

            <button
              onClick={() => setAllOpen(!allOpen)} 
            >
              Jami
              {allOpen ? " ▲" : " ▼"}
            </button>  

            {allOpen && (
              <div
                style={{
                   marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >

                <p>
                  Ish haqi:
                  {
                    getSalary( workerEarnings, currentWorker.phone, "all", selectedDate )
                    .toLocaleString()
                  }
                  so'm
                </p>

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "carpetWasher", "kvm", "all", selectedDate
                  ) > 0 && (
                    <p>
                      Gilam:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "carpetWasher", "kvm", "all", selectedDate
                        )
                      }
                    </p>
                  )
                }  

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "blanketWasher", "blanket", "all", selectedDate
                  )> 0 && (
                    <p>
                      Adyol:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "blanketWasher", "blanket", "all", selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz","all", selectedDate
                  )> 0 && (
                    <p>
                      Yakandoz:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", "all", selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", "all", selectedDate
                  )> 0 && (
                    <p>
                      Parda:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", "all", selectedDate
                        )
                      }
                    </p>
                  )
                }

                <p>
                  Ish soati:
                  {
                    getHours(
                      attendance, currentWorker.phone, "all", selectedDate
                    )
                  }
                </p>

              </div> 
            )} 
          </div>


          {/* ===== washer sana boyicha ===== */}
          <div
            style={{
              marginTop: 10,
              padding: 10,
              border: "3px solid #ccc",
            }} 
          >

            <label>
              Sana
            </label>

            <input
              type="date"

              value={selectedDate}

              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }

              style={{
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 5,
                marginLeft: 10,
              }}
            />

            {selectedDate &&(
              <div
                style={{
                   marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  Ish haqi:
                  {
                    getSalary( workerEarnings, currentWorker.phone, "custom", selectedDate )
                    .toLocaleString()
                  }
                  so'm
                </p>
                {
                  getCount(
                    workerEarnings, currentWorker.phone, "carpetWasher", "kvm", "custom", selectedDate
                  ) > 0 && (
                    <p>
                      Gilam:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "carpetWasher", "kvm", "custom", selectedDate
                        )
                      }
                    </p>
                  )
                }  

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "blanketWasher", "blanket", "custom", selectedDate
                  )> 0 && (
                    <p>
                      Adyol:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "blanketWasher", "blanket", "custom", selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz","custom", selectedDate
                  )> 0 && (
                    <p>
                      Yakandoz:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "yakandozWasher", "yakandoz", "custom", selectedDate
                        )
                      }
                    </p>
                  )
                }

                {
                  getCount(
                    workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", "custom", selectedDate
                  )> 0 && (
                    <p>
                      Parda:
                      {
                        getCount(
                          workerEarnings, currentWorker.phone, "curtainWasher", "curtainMeter", "custom", selectedDate
                        )
                      }
                    </p>
                  )
                }

                <p>
                  Ish soati:
                  {
                    getHours(
                      attendance, currentWorker.phone, "custom", selectedDate
                    )
                  }
                </p>
              </div>
            )}

          </div>
        </>

      )}
 
    </>

  )

}