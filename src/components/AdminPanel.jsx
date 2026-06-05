import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export default function AdminPanel({

  workers,
  workerRequests,
  approveWorker,
  rejectWorker,
  editingWorker,
  setEditingWorker,
  changeWorkerRole,
  changeWorkerStatus,
  washerPrices,
  setWasherPrices,
  priceInputs,
  setPriceInputs,
  savePrices,
  attendance,
  getSalary,
  getHours,
  getCount,
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
  driverPrices,
  tayyorlovchiPrices,
  getHourlyPrice,
  setRole,
  editingStatus,
  setEditingStatus,
  expandedWorker,
  setExpandedWorker,
  orders,
  setOrders,
  allowedRoles,
  setAllowedRoles,
  getAttendanceSalary,

}) {

  return (

    <div>
          <h1>Admin panel</h1>
    
          <button
            onClick={() => setRole("")}
            style={{fontSize: 20}}  
          >
            ⏪️
          </button>
    
          <hr />
    
          <h2>Yangi so'rovlar</h2>
    
          {workerRequests
            .filter(
              (r) => r.status === "pending"
            )
            .map((request) => (
              <div
                key={request.firebaseId}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <p>
                  <b>Ism:</b> {request.name}
                </p>  
    
                <p>
                  <b>Telefon:</b>
                  {request.phone}
                </p>
    
                <p>
                  <b>Lavozimlar:</b>{" "}
                  {request.requestedRoles?.join(
                    ", "
                  )}
                </p>
    
                <button
                  onClick={() =>
                    approveWorker(request)
                  }
                >
                  Tasdiqlash
                </button>
    
                <button
                  onClick={() =>
                    rejectWorker(
                      request.firebaseId
                    )
                  }
                  style={{
                    marginLeft: 10,
                    background: "red",
                    color: "white",
                  }}
                >
                  Rad etish
                </button>
    
              </div>
            ))
          }
    
          {/* ===== ishchilar malumoti ===== */}
          <h2>Ishchilar</h2>
    
          {workers
            .filter(
              (worker) => !worker.roles?.includes("ega")
            )
            .map((worker) => (
          <div
            key={worker.firebaseId}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,  
            }}
          >
            <p>
              <b>Ism:</b>
              {worker.name}
            </p>  
    
            <p> 
              <b>Telefon:</b>
              {worker.phone}
            </p>
    
              <b>Status:</b>
    
              <span
                style={{
                  background:
                    worker.status === "faol" ? "green" :
                    worker.status === "bloklangan" ? "red" : "gray",
    
                  color: "white",
                  padding: "4px 10px", 
                  borderRadius: 20,
                  marginLeft: 2,
                }}
              > 
    
                {worker.status}
    
              </span>
    
              <button
                style={{marginLeft:2,}}
                onClick={() =>
    
                  setEditingStatus(
    
                    editingStatus ===
                    worker.firebaseId
                      ? null
                      : worker.firebaseId
                  )
                }
              >
    
                {editingStatus ===
                worker.firebaseId
                  ? "▲"
                  : "▼"}
    
              </button>
    
              {/* ===== Status edit ===== */}
              {editingStatus === worker.firebaseId && (
              <div
                style={{
                  marginTop: 5,
                }}
              >
    
                <button
                  onClick={() =>
                    changeWorkerStatus( 
                      worker.firebaseId,
                      "faol"
                    )
                  }
                >
                  🟢
                </button>
    
                <button
                  onClick={() =>{
                    changeWorkerStatus( 
                      worker.firebaseId,
                      "nofaol"
                    )
                  }}
                >
                  ⚪️
                </button> 
     
                <button
                  onClick={() =>
                    changeWorkerStatus(
                      worker.firebaseId,
                      "bloklangan"
                    )
                  }
                >
                  🔴
                </button>
    
              </div>
              )}
    
            <br />
    
            <b>Rolelar:</b>{" "}
              {worker.roles?.join(", ")}
    
              <button
                style={{marginLeft:3}}
                onClick={() =>
                  setEditingWorker(
                    editingWorker === worker.firebaseId
                    ? null : worker.firebaseId,
                  )
                }
              >
                {editingWorker ===
                  worker.firebaseId
                  ? "▲"
                  : "▼"
                }
              </button>
    
              {editingWorker === worker.firebaseId && (
              <div
                style={{
                  marginTop: 10,
                }}
              >
    
                {[
                  "operator",
                  "driver",
                  "washer",
                  "tayyorlovchi",
                  ...(allowedRoles.includes(
                    "ega"
                  )
                    ? ["admin"]
                    : []),
                ].map((role) => (
    
                <label
                  key={role}
                  style={{
                    display: "block",
                  }}
                >
    
                  <input
                    type="checkbox" 
    
                    checked={
                      worker.roles?.includes(
                        role
                      )
                    }
    
                    onChange={async (e) => {
    
                      let updatedRoles =
                        worker.roles || []
    
                      if (
                        e.target.checked
                      ) {
    
                        updatedRoles = [
                          ...updatedRoles,
                          role,
                        ]
        
                      } else {
    
                        updatedRoles =
                          updatedRoles.filter(
                            (r) =>
                              r !== role
                          )
                      }
    
                      const workerRef = doc(
                        db,
                        "workers",
                        worker.firebaseId
                      )
    
                      await updateDoc(
                        workerRef,
                        {
                          roles: updatedRoles,
                        }
                      )
    
                    }}
                  />
    
                  {role}
    
                </label>
                ))} 
              </div>
      
            )}

            <select
              value={
                worker.primaryRole ||
                worker.roles?.[0] ||
                ""
              }

              onChange={async (e) => {

                await updateDoc(
                  doc(
                    db,
                    "workers",
                    worker.firebaseId
                  ), {
                    primaryRole:
                    e.target.value
                  }
                )

              }}
            >

              {worker.roles?.map((role) => (

                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>

              ))}

            </select>

            <br />
    
            <button
              onClick={() =>
    
                setExpandedWorker(
    
                  expandedWorker ===
                  worker.firebaseId
    
                    ? null
    
                    : worker.firebaseId
                )
              }
            >
    
              {expandedWorker ===
              worker.firebaseId
    
                ? "▲"
    
                : "▼"}
      
            </button>
    
            {expandedWorker ===
              worker.firebaseId && (
    
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                }}
              >
    
                {/*  ===== Driver statistic ===== */}
                {worker.roles?.includes(
                  "driver"
                ) && (
                <div>
    
                  <p>
                    <b>Bugungi ish soati:</b>
                    {getHours(attendance, worker.phone, 1, selectedDate)} 
                  </p>
                
                  <p>
                    <b>Bugungi ish haqi:</b>
      
                    {" "}{getAttendanceSalary(attendance, worker.phone, 1, selectedDate)}
      
                    so'm
                  </p>
      
                  <p>
                    <b>Haftalik:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, 7, selectedDate)}
      
                    so'm
                  </p>
      
                  <p>
                    <b>Oylik:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, 30, selectedDate)}
      
                    so'm
                  </p>
    
                  <p>
                    <b>jami:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, "all", selectedDate)}
      
                    so'm
                  </p>
    
                </div>
                )}
    
                {worker.roles?.includes(
                  "tayyorlovchi"
                ) && (
                <div>
    
                  <p>
                    <b>Bugungi ish soati:</b>
                    {getHours(attendance, worker.phone, 1, selectedDate)} 
                  </p>
                
                  <p>
                    <b>Bugungi ish haqi:</b>
      
                    {" "}{getAttendanceSalary(attendance, worker.phone, 1, selectedDate)}  
      
                    so'm
                  </p>
      
                  <p>
                    <b>Haftalik:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, 7, selectedDate)}
      
                    so'm
                  </p>
      
                  <p>
                    <b>Oylik:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, 30, selectedDate)}
      
                    so'm
                  </p>
    
                  <p>
                    <b>jami:</b>
    
                    {" "}{getAttendanceSalary(attendance, worker.phone, "all", selectedDate)}
      
                    so'm
                  </p>
    
                </div>
                )}
    
                {/* ===== washer statistic ===== */}
                {worker.roles?.includes(
                  "washer"
                ) && (
                <div>
    
                  <p>
                    <b>Bugungi ish soati:</b>
                    {
                      getHours(attendance, worker.phone, 1, selectedDate)
                    }
                  </p>
    
                  <p>
                    <b>Gilam kv.m:</b>
                    {
                      getCount(
                        orders, worker.phone, "carpetWasher", "kvm", 1, selectedDate
                      )
                    }  
                  </p>
    
                  <p>
                    <b>Adyol:</b> 
                    { 
                      getCount(
                        orders, worker.phone, "blanketWasher", "blanket", 1, selectedDate
                      )
                    }
                  </p>
    
                  <p>
                    <b>Yakandoz:</b>
                    {
                      getCount(
                        orders, worker.phone, "yakandozWasher", "yakandoz", 1, selectedDate
                      )
                    }
                  </p>
    
                  <p>
                    <b>Parda metri:</b>              
                      {
                        getCount(
                          orders, worker.phone, "curtainWasher", "curtainMeter", 1, selectedDate
                        )
                      }
                  </p>
    
                  <p>
                    <b>Ish haqi:</b>
                    {getSalary( orders, worker.phone, 1, selectedDate )}
                    so‘m
                  </p>
    
                  <p>
                    <b>Haftalik:</b>
                    {getSalary( orders, worker.phone, 7, selectedDate )}
                    so‘m
                  </p>
    
                  <p>
                    <b>Oylik:</b>
                    {getSalary( orders, worker.phone, 30, selectedDate )}
                    so‘m
                  </p>
    
                  <p>
                    <b>Jami:</b>
                    {
                      (
                        ( 
                          orders
    
                          .filter((o) => 
                            o.carpetWasher !== worker.phone
                          )
    
                          .reduce(
                            (sum, o) => sum + 
                            Number(o.carpetSalary || 0) +
                            Number(o.blanketSalary || 0) +
                            Number(o.yakandozSalary || 0) +
                            Number(o.curtainSalary || 0), 
                            0
                          )
                        )
                      ).toLocaleString()
                    }
                    so'm
                  </p>
      
                </div>
                )}
    
              </div>
            )}
    
          </div>  
          ))}
           
        </div> 

  )

}