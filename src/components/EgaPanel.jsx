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

            <p>Driver olish (1 kv.m)</p>

            <input
              value={driverPrices.pickup || ""}

              onChange={(e) =>
                setDriverPrices({
                  ...driverPrices,
                  pickup: e.target.value,
                })
              }
            />

          <p>Driver yetkazish (1 kv.m)</p>

           <input
            value={driverPrices.delivery || ""}

            onChange={(e) =>
              setDriverPrices({
                ...driverPrices,
                delivery: e.target.value,
             })
            }
          />

          <p>Tayyorlovchi (1 kv.m)</p>

          <input
            value={tayyorlovchiPrices.kvm || ""}

            onChange={(e) =>
              setTayyorlovchiPrices({
                ...tayyorlovchiPrices,
                kvm: e.target.value,
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