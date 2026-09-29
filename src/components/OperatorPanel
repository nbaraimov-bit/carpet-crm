import {
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore"

import { db } from "../firebase"

export default function OperatorPanel({

  orders,
  activeOrders,
  finishedOrders,
  phone,
  setPhone,
  address,
  setAddress,
  comment,
  setComment,
  tarif,
  setTarif,
  addOrder,
  editingId,
  setEditingId,
  editPhone,
  setEditPhone,
  editAddress,
  setEditAddress,
  editComment,
  setEditComment,
  deleteOrderId,
  setDeleteOrderId,
  updateStatus,
  setRole,
  role,
  loading,
  runAction,

}) {

  return (

    <div>
      <h1>Carpet CRM</h1>
    
      <p>Role: <b>{role}</b></p>
    
      <button 
        onClick={() => setRole("")}
        style={{fontSize: 20}}
      >
        ⏪️
      </button>
    
      <br />
    
      <hr />
    
      <br />
    
      <div
        style={{
          border: "2px solid #0000ff",
          padding: 5,
          marginBottom: 10,
        }}
      >
      <details>
      <summary>
        yangi buyurtma
      </summary>
    
              
              
      <div
        style={{
          border: "2px solid #0000ff",
          padding: 1,
          marginBottom: 10,
        }}
      >
        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: 10
          }}
        />
        </div> 
    
        <div
          style={{
            border: "2px solid #0000ff",
            padding: 1,
             marginBottom: 10,
          }}
        >
          <input
            placeholder="Manzil"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              padding: 10
            }}
          />
          </div>
    
          <div
            style={{
              border: "2px solid #0000ff",
              padding: 1,
              marginBottom: 10,
            }}
          >
            <input
              placeholder="Izoh"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                padding: 10
              }}
            />
          </div>
    
          <select
            value={tarif}
            onChange={(e) => setTarif(
              e.target.value
            )}
          >
            <option value="standart">
              Standart
            </option>
    
            <option value="tezkor">
              Tezkor
            </option>
          </select>
    
          <button
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: "blue",
              color: "white"
            }}
            disabled={loading["addOrder"]}
            onClick={() =>
              runAction("addOrder", async () => {
                await addOrder();
              })
            }
          >
            {loading["addOrder"]
              ? "⏳ Saqlanmoqda..." : "Buyurtma qabul qilish"}
          </button>
      
        </details>
      </div>
    
          
     
      <h2>Aktiv buyurtmalar</h2>

      {activeOrders.map((order) => (
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
          <p><b>Mijoz ID:</b> {order.customerId}</p>
          <p><b>Buyurtma ID:</b> {order.id}</p>
          <details>
            <summary>
              batafsil
            </summary>
            {order.carpetCount && (<p><b>Gilam:</b> {order.carpetCount}</p>)}
            {order.kvm && (<p><b>Kv.m:</b> {order.kvm}</p>)}
            {order.blanketCount && (<p><b>Adyol:</b> {order.blanketCount}</p>)}
            {order.yakandozCount && (<p><b>Yakandoz:</b> {order.yakandozCount}</p>)}
            {order.curtainCount && (<p><b>Parda:</b> {order.curtainCount}</p>)}
            {order.curtainMeter && (<p><b>Parda metri:</b> {order.curtainMeter}</p>)}
            {order.other && (<p><b>Boshqa:</b> {order.other}</p>)}
            <p><b>Tarif:</b>{" "}{order.tarif}</p>
            {order.price && (<p><b>Jami narx:</b> {order.price}</p>)}
            {order.carpetStatus && (<p><b>Gilam status:</b>{order.carpetStatus}</p>)}
            {order.blanketStatus && (<p><b>Adyol status:</b>{order.blanketStatus}</p>)}
            {order.yakandozStatus && (<p><b>Yakandoz status:</b>{order.yakandozStatus}</p>)}
            {order.curtainStatus && (<p><b>Parda status:</b>{order.curtainStatus}</p>)}
            <p><b>Status:</b> {order.status}</p>
            {order.comment && (<p><b>Izoh:</b>{" "}{order.comment}</p>)}
            {order.driverComment&&(<p><b>izoh:</b>{" "}{order.driverComment}</p>)}

            <div style={{ marginTop: 30 }}>
                
              {editingId === order.id ? (
                <div
                  style={{
                    border: "2px solid #0000ff",
                    padding: 10,
                    marginBottom: 20,
                  }}
               
                >
    
                  <div
                    style={{
                      border: "2px solid #0000ff",
                      marginBottom: 10,
                    }}
                  >
                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 5
                      }}
                    />
                  </div>
    
                  <div
                    style={{
                      border: "2px solid #0000ff",
                      marginBottom: 10,
                    }}
                  >
                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 5
                      }}
                    />
                  </div>

                    <div
                    style={{
                      border: "2px solid #0000ff",
                      marginBottom: 10,
                    }}
                  >
                    <input
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 5
                      }}
                    />
                  </div>    

                  <br />
    
                  <button
                    onClick={async () => {
                      await updateDoc(doc(
                        db,
                        "orders",
                        order.firebaseId
                      ),{
                        phone: editPhone,
                        address: editAddress,
                        comment: editComment,
                      })
    
                      setEditingId(null)
                    }}
                    style={{
                      width: "100%",
                      padding: 5,
                      background: "blue",
                      color: "white",
                      borderRadius: 10
                    }}
                  >
                    Saqlash
                  </button>
    
                </div>
    
                ) : (
    
                  <button
                    onClick={() => {
                      setEditingId(order.id)
                      setEditPhone(order.phone)
                      setEditAddress(order.address)
                      setEditComment(order.comment || "" )
    
                    }}
                    style={{
                      padding: 3,
                      background: "orange",
                      color: "white",
                      width: 60,
                      borderRadius: 5,
                    }}
                  >
                    Edit
                  </button>
                )
              }

              <button
                onClick={() => setDeleteOrderId(order.firebaseId)}
                style={{
                  background: "red",
                  color: "white",
                  marginLeft: 30,
                  width: 60,
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                Delete
              </button>
      
            </div>
          </details>
        </div>
      ))}

      {deleteOrderId && (
      
            <div
              style={{
                position: "fixed",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "white",
                padding: 30,
                borderRadius: 12,
                border: "3px solid #ff0000",
                zIndex:1000,
                width: 300,
                textAlign: "center",
                boxShadow:"0 0 50px rgb(255, 0, 0)",
              }}
            >
      
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 19,
                }}
              >
                <h3
                  style={{
                   color: "black"
                  }}
                >
                  Buyurtma
                  o'chirilsinmi?
                </h3>
              </div>
      
              <button
                onClick={async () => {
      
                  await deleteDoc(
                    doc(
                      db,
                      "orders",
                      deleteOrderId
                    )
                  )
          
                  setDeleteOrderId(null)
       
                }}
                style={{
                  background: "red",
                  color: "white",
                  marginRight: 40,
                   width: 50,
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                Ha
              </button>
      
              <button
                onClick={() =>
                  setDeleteOrderId(null)
                }
                style={{
                  background: "green",
                  color: "white",
                  width: 50,
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                Yo'q
              </button>
          
            </div>
      
          )}
            
    </div>

  )

}