import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
export default function EgaPanel({

  setRole,

  priceInputs,
  setPriceInputs,

  driverPrices,
  setDriverPrices,

  tayyorlovchiPrices,
  setTayyorlovchiPrices,

  savePrices,

}) 

{

  return(

    <div>
    
        <>
          <button onClick={() => setRole("")}
            style={{fontSize: 25,}}>
            {"⏪️"}
          </button>
        
          <div
            style={{
              border:
                "1px solid #ccc",
              padding: 10,
              marginTop: 20,
            }}
          >

            <h2>Ish haqi</h2> 
   
            <p>Gilam</p>
  
            <input
              value={ priceInputs.carpet || "" }

              onChange={(e) =>
                setPriceInputs({ ...priceInputs, carpet: e.target.value,})
              }
            />

            <p>Adyol</p>

            <input
              value={ priceInputs.blanket || "" }

              onChange={(e) =>
                setPriceInputs({ ...priceInputs, blanket: e.target.value, })
              }
            />

            <p>Yakandoz</p>

            <input
              value={ priceInputs.yakandoz || "" }
  
              onChange={(e) =>
                setPriceInputs({ ...priceInputs, yakandoz: e.target.value, })
              }
            />

            <p>Parda</p>

            <input
              value={ priceInputs.curtain || "" } 
 
              onChange={(e) =>
              setPriceInputs({ ...priceInputs, curtain: e.target.value, })
              }
            />

            <h3>🚚 Driver (Olib kelish)</h3>

            <p>Gilam</p>
            <input
              value={driverPrices.pickupCarpet || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, pickupCarpet: e.target.value,
                })
              }
            />

            <p>Adyol</p>
            <input
               value={driverPrices.pickupBlanket || ""}
               onChange={(e) =>
                  setDriverPrices({
                    ...driverPrices, pickupBlanket: e.target.value,
                })
              }
            />

            <p>Yakandoz</p>
            <input
              value={driverPrices.pickupYakandoz || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, pickupYakandoz: e.target.value,
                })
              }
            />

            <p>Parda</p>  
            <input
              value={driverPrices.pickupCurtain || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, pickupCurtain: e.target.value,
                })
              }
            />

            <h3>🚚 Driver (Yetkazish)</h3>

            <p>Gilam</p>
            <input
              value={driverPrices.deliveryCarpet || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, deliveryCarpet: e.target.value,
                })
              }
            />

            <p>Adyol</p>
            <input
              value={driverPrices.deliveryBlanket || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, deliveryBlanket: e.target.value,
                })
              }
            />

            <p>Yakandoz</p>
            <input
              value={driverPrices.deliveryYakandoz || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, deliveryYakandoz: e.target.value,
                })
              }
            />

            <p>Parda</p>
            <input
              value={driverPrices.deliveryCurtain || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, deliveryCurtain: e.target.value,
                })
              }
            />

            <p>Leader (%)</p>
            <input
              value={driverPrices.leaderPercent || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, leaderPercent: e.target.value,
                })
              }
            />

            <p>Yordamchi (%)</p>
            <input
              value={driverPrices.helperPercent || ""}
              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices, helperPercent: e.target.value,
                })
              }
            />

          <h3>📦 Tayyorlovchi</h3>

          <p>Gilam</p>
            <input
              value={tayyorlovchiPrices.carpet || ""}
              onChange={(e) =>
                setTayyorlovchiPrices({
                  ...tayyorlovchiPrices, carpet: e.target.value,
                })
              }
            />

            <p>Adyol</p>
            <input
              value={tayyorlovchiPrices.blanket || ""}
              onChange={(e) =>
                setTayyorlovchiPrices({
                  ...tayyorlovchiPrices, blanket: e.target.value,
                })
              }
            />

            <p>Yakandoz</p>
            <input
              value={tayyorlovchiPrices.yakandoz || ""}
              onChange={(e) =>
                setTayyorlovchiPrices({
                  ...tayyorlovchiPrices, yakandoz: e.target.value,
                })
              }
            />

           <p>Parda</p>
           <input
              value={tayyorlovchiPrices.curtain || ""}
              onChange={(e) =>
                setTayyorlovchiPrices({
                  ...tayyorlovchiPrices, curtain: e.target.value,
                })
              }
            />

            <p>
              <button
                onClick={savePrices}
              >
                Saqlash
              </button>
            </p>

          </div>
        </>    
    </div>
  )
}