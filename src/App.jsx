import WasherPanel from "./components/WasherPanel"
import DriverPanel from "./components/DriverPanel"
import OperatorPanel from "./components/OperatorPanel"
import AdminPanel from "./components/AdminPanel"
import getCount from "./utils/getCount"
import getHours from "./utils/getHours"
import getSalary from "./utils/getSalary"
import { useState, useEffect } from "react"
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
  getDocs
} from "firebase/firestore";

function App() {
  const [orders, setOrders] = useState([])
  const [role, setRole] = useState("")
  const [allowedRoles, setAllowedRoles] = useState([])
  const [driverMode, setDriverMode] = useState("") 
  const [washerMode, setWasherMode] = useState("")
  const [carpetCount, setCarpetCount] = useState("")
  const [kvm, setKvm] = useState("")
  const [blanket, setBlanket] = useState("")
  const [yakandoz, setYakandoz] = useState("")
  const [curtainCount, setCurtainCount] = useState("")
  const [curtainMeter, setCurtainMeter] = useState("")
  const [curtainPrice, setCurtainPrice] = useState("")
  const [other, setOther] = useState("")
  const [price, setPrice] = useState("")
  const [workerName, setWorkerName] = useState("")
  const [workerPhone, setWorkerPhone] = useState("")
  const [requestedRoles, setRequestedRoles,] = useState([])
  const [requestSent,setRequestSent,] = useState(false)
  const [workerRequests,setWorkerRequests,] = useState([])
  const [loginPhone, setLoginPhone] = useState("")
  const [currentWorker,setCurrentWorker] = useState(null)
  const [workers, setWorkers] = useState([])
  const [editingWorker,setEditingWorker] = useState(null)
  const [attendance,setAttendance] = useState([])
  const [expandedWorker,setExpandedWorker] = useState(null)
  const [editingStatus,setEditingStatus] = useState(null)
  const [washerPrices,setWasherPrices] = useState({})
  const [priceInputs,setPriceInputs] = useState({})
  const [todayOpen,setTodayOpen] = useState(false)
  const [weekOpen,setWeekOpen] = useState(false)
  const [MonthOpen,setMonthOpen] = useState(false)
  const [allOpen,setAllOpen] = useState(false)
  const [selectedDate,setSelectedDate] = useState("")
  const [operatorMode, setOperatorMode] = useState("")
  const [comment, setComment] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] =  useState("")
  const [editingId, setEditingId] = useState(null)
  const [editPhone, setEditPhone] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editComment, setEditComment] = useState("")
  const [deleteOrderId, setDeleteOrderId] = useState(null) 
  const [driverPrices, setDriverPrices] = useState({})
  const [tayyorlovchiPrices, setTayyorlovchiPrices] = useState({})
  const [tarif, setTarif] = useState("standart")
  const [driverComment, setDriverComment] = useState("")
  const [showArchive, setShowArchive] = useState(false)
  const [archives, setArchives] = useState([])
  const [archiveSearch, setArchiveSearch] = useState("")
  //const [telegramId, setTelegramId] = useState("")

  const tg = window.Telegram?.WebApp


  const sendWorkerRequest =
    async () => {

      const telegramId = String(tg?.initDataUnsafe?.user?.id || "")

      alert(tg?.initDataUnsafe?.user?.id)

      if (!workerName.trim()) {
        alert("Ism kiriting")
        return
      }

      if (!workerPhone.trim()) {
        alert("Telefon kiriting")
        return
      }

      if (requestedRoles.length === 0) {
        alert("Kamida 1 ta lavozim tanlang")
        return
      }

      await addDoc(
        collection(db, "workerRequests"),
        { 
          name: workerName,
          phone: workerPhone,
          requestedRoles,
          telegramId,
          status: "pending",
          createdAt: serverTimestamp(),
        }
      )

      setRequestSent(true)

      setWorkerName("")
      setWorkerPhone("")
      setRequestedRoles([])
  }

  const approveWorker =
    async (request) => {

    await addDoc(
      collection(db, "workers"),
      {
        name: request.name,
        phone: request.phone,
        telegramId: request.telegramId,
        roles: request.requestedRoles,
        approved: true,
        status: "nofaol",
        working: false,
        startedAt: null,
      }
    )

    const requestRef = doc(
      db,
      "workerRequests",
      request.firebaseId
    )

     await updateDoc(requestRef, {
      status: "approved",
    })
  }

  const rejectWorker = async (requestId) => {

    const requestRef = doc(
      db,
      "workerRequests",
      requestId
    )

    await updateDoc(requestRef, {
      status: "rejected",
    })
  }

  const loginWorker = async () => {

    const q = query(
      collection(db, "workers"),
      where(
        "phone",
        "==",
        loginPhone
      )
    )

    const snapshot = await getDocs(q) 
 
    if (snapshot.empty) {
      alert(
        "Worker topilmadi"
      )
      return
    }

    const workerDoc = snapshot.docs[0]
    const worker = {firebaseId: workerDoc.id, ...workerDoc.data()}
    const telegramId = tg?.initDataUnsafe?.user?.id
 
    let roles = worker.roles

    await updateDoc(
      doc(
        db,
        "workers",
        worker.firebaseId
      ),
      { telegramId: tg?.initDataUnsafe?.user?.id || null}
    )

    const updatedWorker = {
      ...worker,
     roles,
    telegramId: tg?.initDataUnsafe?.user?.id || null
    }

    setCurrentWorker(updatedWorker)
    setAllowedRoles(roles)
    setRole("")  

    localStorage.setItem(
      "worker",
      JSON.stringify(updatedWorker)
    )

  }

  const logout = () => {

    localStorage.removeItem(
      "worker"
    )

    setCurrentWorker(null)

    setAllowedRoles([])

    setRole("")
  }

  const changeWorkerRole = async (
    workerId,
    role
  ) => {

    const workerRef = doc(
      db,
      "workers",
      workerId
    )

    await updateDoc(
      workerRef,
      {
        roles: [role],
      }
    )

    setEditingWorker(null)
  }

  const startWork =
  async () => {

    if (activeWorker.working) return

    if (!currentWorker) return

    const workerDoc =
      workers.find(
        (w) =>
          w.phone ===
          currentWorker.phone
      )

    if (!workerDoc) return

    const workerRef = doc(
      db,
      "workers",
      workerDoc.firebaseId
    )

    await updateDoc(
      workerRef,
      {
        working: true,
        status: "faol",
        startedAt: new Date(),
      }
    )
  }

  const stopWork = async (workerData = null) => {

    const activeWorker = workerData || currentWorker
    if (!activeWorker.working) return

    if (!activeWorker) return

    console.log("1-kirdi")

    const workerDoc =
      workers.find(
        (w) =>
          w.phone ===
          activeWorker.phone
      )

    if (!workerDoc) return

    console.log("2-worker topildi")

    const workerRef = doc(
      db,
      "workers",
      workerDoc.firebaseId
    )

    const startedAt = workerDoc.startedAt ?.toDate()

    const endedAt = new Date()

    const totalHours =
      (
        (
          endedAt -
          startedAt
        ) /
        1000 /
        60 /
        60
      ).toFixed(2)

      console.log("attendance yozilyapti")

    await addDoc(
      collection(
        db,
        "attendance"
      ),
      {
        workerName:
          workerDoc.name,

        workerPhone:
          workerDoc.phone,

        startedAt,
        endedAt,  
  
        totalHours:
          Number(totalHours), 

        createdAt:
          serverTimestamp(),
      }
    )

     console.log("3-attendance yozildi")

    await updateDoc(
      workerRef,
      {
        working: false,
        status: "nofaol",
        startedAt: null
      }
    )

    setWorkers(
      workers.map((w) =>
        w.firebaseId === workerDoc.firebaseId
        ? {...w, working: false} : w
      )
    )
  }

  const changeWorkerStatus =  async (
    workerId,
    newStatus
  ) => {
      console.log(
        workerId,
        newStatus
      )

    const workerRef =
      doc(
        db,
        "workers",
        workerId
      )

    await updateDoc(
      workerRef,
      {
        status: newStatus,
        working: newStatus === "faol",
        startedAt: newStatus === "faol" ? new Date() : null
      }
    )
  }

  const savePrices = async () => {

    await updateDoc(

      doc(
        db,
        "settings",
        "washerPrices"
      ),

      {
        carpet: Number(priceInputs.carpet),
        blanket: Number(priceInputs.blanket),
        yakandoz: Number(priceInputs.yakandoz),
        curtain: Number(priceInputs.curtain),
      }
    )

    await updateDoc(
      doc(
        db,
        "settings",
        "driverPrices"
      ),

      {
        hour: Number(driverPrices.hour)
      }

    )

    await updateDoc(
      doc(
        db,
        "settings",
        "tayyorlovchiPrices"
      ),

      {
        hour:Number(tayyorlovchiPrices.hour)
      }

    )
  }


  const getHourlyPrice = (
    worker
  ) => {

    if (
      worker.roles?.includes("driver")
    ) {
      return (driverPrices.hour || 0)
    }

    if (
      worker.roles?.includes("tayyorlovchi")
    ) {
      return (tayyorlovchiPrices.hour || 0)
    }

    return 0
  }

  const today = new Date()

  const todayArchives = archives.filter((o) => {

    if (!o.createdAt) return false

    const d =
      o.createdAt.toDate()

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )

  })

  const dailyIncome = todayArchives.reduce(
    (sum, o) =>
      sum + Number(o.price || 0),
    0
  )

  const dailyWasherSalary = todayArchives.reduce(
    (sum, o) => {

      return (
        sum +
        Number(o.carpetSalary || 0) +
        Number(o.blanketSalary || 0) +
        Number(o.yakandozSalary || 0) +
        Number(o.curtainSalary || 0)
      )

    },
    0
  )

  const todayAttendance = attendance.filter((a) => {

    if (!a.createdAt) return false

    const d =
      a.createdAt.toDate()

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )

  })

  const dailyHourlySalary = todayAttendance.reduce(
    (sum, a) => {

      const worker = workers.find(
        (w) => w.phone === a.workerPhone
      )

      const hourly = getHourlyPrice(worker)

      return (
        sum + hourly * Number(a.totalHours || 0)
      )

    },
    0
  )

  const totalDailySalary =
  dailyWasherSalary +
  dailyHourlySalary


  {/* ===== use effectlar ===== */}
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
          firebaseId: document.id,
        }))

        setOrders(
          data.sort(
            (a, b) =>b.createdAt - a.createdAt
          )
        );

      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "workerRequests"),
        (snapshot) => {
          const data =
            snapshot.docs.map((doc) => ({
              firebaseId: doc.id,
              ...doc.data(),
            }))

          setWorkerRequests(data)
        }
      )

    return () => unsubscribe()
  }, [])

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "workers"),
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                firebaseId: doc.id,
                ...doc.data(),
              })
            )

          setWorkers(data)
        }
      )

    return () => unsubscribe()

  }, [])

  useEffect(() => { 

    const savedWorker =
      localStorage.getItem(
        "worker"
      )

    if (savedWorker) {

      const worker =
        JSON.parse(savedWorker)

      setCurrentWorker(worker)

    if (worker.roles.includes("ega")) {
      setAllowedRoles([
        "operator",
        "driver",
        "washer",
        "tayyorlovchi",
        "admin",
        "ega",
      ])

      setRole("")
    }
    else if (
      worker.roles.includes("admin")
    ) {
      setAllowedRoles([
        "operator",
        "driver",
        "washer",
        "tayyorlovchi",
        "admin",
      ])

      setRole("")
    }
    else {
      setAllowedRoles(worker.roles)
      setRole("")
    }
    }

  }, [])

  useEffect(() => {

    const unsubscribe =
    onSnapshot(
      collection(
        db,
        "attendance"
      ),
      (snapshot) => {

        const data =
        snapshot.docs.map(
          (doc) => ({
            firebaseId: doc.id,
            ...doc.data(),
          })
        )

        setAttendance(data)
      }
    )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    const getPrices = async () => {

      const docRef = doc(db, "settings", "washerPrices")  
      const snap = await getDoc(docRef)
 
      if (snap.exists()) {
        setWasherPrices(snap.data())
        setPriceInputs(snap.data())
      }
    }

    getPrices()

  }, [])

  useEffect(() => {

    if (!currentWorker?.firebaseId)
      return

    const unsubscribe = onSnapshot(

      doc(
        db,
        "workers",
        currentWorker.firebaseId
      ),

      (snapshot) => {

        const data = snapshot.data()
         
        if (
          !currentWorker?.roles?.includes("admin") &&
          !currentWorker?.roles?.includes("ega") &&
          JSON.stringify(data.roles || []) !==
          JSON.stringify(currentWorker.roles || [])
          ) {

          localStorage.removeItem("worker")

          window.location.reload()

          return
        }

        if (!data) return

        setAllowedRoles(data.roles || [])

        setCurrentWorker({
          ...currentWorker,
          ...data
        }) 

        if (
          data.status === "bloklangan"
        ) {
          localStorage.removeItem("worker")
          setCurrentWorker(null)
          setRole("")
          alert("Siz bloklangansiz")

          return
        }

      }

    )

    return () => unsubscribe()

  }, [currentWorker?.firebaseId])

  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(
        db,
        "settings",
        "driverPrices"
      ),

      (snapshot) => {setDriverPrices(snapshot.data() || {})}
    )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(
        db,
        "settings",
        "tayyorlovchiPrices"
      ),

      (snapshot) => {setTayyorlovchiPrices(snapshot.data() || {})}

    )

    return () => unsubscribe()

  }, [])

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

  {/* ===== add order ===== */}
  const addOrder = async () => {

    if (!phone || !address) return

    const customersSnapshot = await getDocs(
      collection(
        db,
        "customers"
      )
    )

    const customers = customersSnapshot.docs.map(
      (doc) => ({
        firebaseId: doc.id,
        ...doc.data(),
      })
    )

    const existingCustomer = customers.find(
      (c) => c.phone === phone
    )

    let customerId = ""

    if (existingCustomer) {
      customerId = existingCustomer.customerId
    } else {
      const nextCustomerNumber = customers.length + 1

      customerId = `C${String(
        nextCustomerNumber
      ).padStart(4, "0")}`

      await addDoc(
        collection(
          db,
          "customers"
        ), {
          customerId,
          phone,
          address,
          ordersCount: 1,
          createdAt: Date.now(),
        }
      )

    }

    const counterRef = doc(
      db,
      "counters",
      "orders"
    )

    const counterSnap = await getDoc(counterRef)
    const lastOrderNumber = Number( counterSnap.data() ?.lastOrderNumber) || 0
    const nextOrderNumber = lastOrderNumber + 1

    await updateDoc(counterRef,{
      lastOrderNumber: nextOrderNumber
    })

    const orderId = `AA${String(
      nextOrderNumber
    ).padStart(4, "0")}`

    const newOrder = {
      id: orderId,
      customerId,
      phone,
      address,
      status: "Yangi",
      comment,
      tarif,
      createdAt: Date.now()
    }

    await addDoc(
      collection(db, "orders"),
      newOrder
    )
    setPhone("")
    setAddress("")
    setComment("")
  }

  {/* ===== update status ===== */}
  const updateStatus = async (id, status) => {

    const orderRef =
      doc(
        db,
        "orders",
        id
      )

    if (status === "Yetkazildi") {

      const order = orders.find((o) => o.firebaseId === id)  

      await addDoc(
        collection(
          db,
          "archives"
        ),{
          ...order,
          status: "Yetkazildi",
          archivedAt: Date.now(),
        }
      )

      await deleteDoc(orderRef)

      return
    }

    await updateDoc(
      orderRef,
      {
        status: status,
      }
    )
  }

  {/* ===== save detail ===== */}
  const saveDetails = async (id) => {
    const orderRef = doc(db, "orders", id)

    await updateDoc(orderRef, {
      carpetCount,
      kvm,
      blanket,
      yakandoz,
      curtainCount,
      curtainMeter,
      curtainPrice,
      other,
      driverComment,
      price,
      carpetStatus: carpetCount
        ? "Kutmoqda"
        : "",
   
      blanketStatus: blanket
        ? "Kutmoqda"
        : "",

      yakandozStatus: yakandoz || other
        ? "Kutmoqda"
        : "",

      curtainStatus: curtainMeter
        ? "Kutmoqda"
        : "",
    })

  }
  
  {/* ===== update wash status ===== */}
  const updateWashStatus = async (
    id,
    field,
    value
  ) => {
    const orderRef = doc(db, "orders", id)

    const order = orders.find(
      (o) => o.firebaseId === id
    )

    const updates = {
      [field]: value,
    }

    if (
      value === "Yuvildi" && currentWorker
    ) {

      updates[field.replace(
        "Status",
        "Date"
      )] = serverTimestamp() 

      let washerSalary = 0

      if (field === "carpetStatus") {
        washerSalary = Number(order.kvm || 0) * washerPrices.carpet
      }

      if (field === "blanketStatus") {
        washerSalary = Number(order.blanket || 0) * washerPrices.blanket
      }

      if (field === "yakandozStatus") {
        washerSalary = Number(order.yakandoz || 0) * washerPrices.yakandoz
      }

      if (field === "curtainStatus") {
        washerSalary = Number(order.curtainMeter || 0) *
        Number(order.curtainPrice || 0) * washerPrices.curtain
      }

      updates[
        field.replace(
          "Status",
          "Salary"
        )
      ] = washerSalary

      updates[
        field.replace(
          "Status",
          "Washer"
        )
      ]
        = currentWorker.phone
    }

    const carpetDone =
      !order.carpetStatus ||
      field === "carpetStatus"
        ? value === "Yuvildi"
        : order.carpetStatus ===
          "Yuvildi"

    const blanketDone =
      !order.blanketStatus ||
      field === "blanketStatus"
        ? value === "Yuvildi"
        : order.blanketStatus ===
          "Yuvildi"

    const yakandozDone =
      !order.yakandozStatus ||
      field === "yakandozStatus"
        ? value === "Yuvildi"
        : order.yakandozStatus ===
          "Yuvildi"

    const curtainDone =
      !order.curtainStatus ||
      field === "curtainStatus"
        ? value === "Yuvildi"
        : order.curtainStatus ===
          "Yuvildi"

    if (
      carpetDone &&
      blanketDone &&
      yakandozDone &&
      curtainDone
    ) {
      updates.status = "Yuvildi"  

      updates.carpetStatus = ""
      updates.blanketStatus = ""
      updates.yakandozStatus = ""
      updates.curtainStatus = ""
    }

    await updateDoc(orderRef, updates)
  }

  const activeOrders = orders.filter(
    (o) =>
      o.status !== "Yetkazildi" &&
      o.status !== "Rad etildi"
  )

  const finishedOrders = orders.filter(
    (o) =>
      o.status === "Yetkazildi" ||
      o.status === "Rad etildi"
  )

  {/* ===== kirish ===== */}
  if (
    allowedRoles.length === 0 &&
    !requestSent
  ) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Kirish</h1>  

        <input
          placeholder="Telefon"
          value={loginPhone}
          onChange={(e) =>
            setLoginPhone(
              e.target.value
            )
          }
        /> 
 
        <br /><br />  

        <button
          onClick={() => {loginWorker()}}
        >
          Kirish
        </button> 
 
        <br /><br />

        <button
          onClick={() =>
            setRequestSent("register")
          }
        >
          Ro'yxatdan o'tish
        </button>
      </div>
    )
  }

  if (allowedRoles.length === 0) {

    if (requestSent === true) {
      return (
        <div style={{ padding: 20 }}>
          <h1>
            Admin tasdiqlashini kuting
          </h1>
        </div>
      )
    }

    {/* ===== ro'yxatdan o'tish ===== */}
    return (
      <div style={{ padding: 20 }}>
      
        <h1>Ro'yxatdan o'tish</h1>

        <input
          placeholder="Ism"
          value={workerName}
          onChange={(e) =>
            setWorkerName(e.target.value)
          }
        />

        <br /><br />
   
        <input
          placeholder="Telefon"
          value={workerPhone}
          onChange={(e) =>
            setWorkerPhone(e.target.value)
          }
        />

        <br /><br />
   
        <h3>Lavozim tanlang</h3>

        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setRequestedRoles([
                  ...requestedRoles,
                  "operator",
                ])
              } else {
                setRequestedRoles(
                  requestedRoles.filter(
                     (r) =>
                      r !== "operator"
                  )
                )
              }
            }}
          />
          Operator
        </label>  

        <br />

        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setRequestedRoles([
                  ...requestedRoles,
                  "driver",
                ])
              } else {
                setRequestedRoles(
                  requestedRoles.filter(
                    (r) =>
                      r !== "driver"
                  )
                )
              }
            }}
          />
          Driver
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setRequestedRoles([
                  ...requestedRoles,
                  "washer",
                ])
              } else {
                setRequestedRoles(
                 requestedRoles.filter(
                    (r) =>
                      r !== "washer"
                  )
                )
              }
            }}
          />
          Washer
        </label>  

        <br />

        <label>
          <input
            type="checkbox"  
            onChange={(e) => {
              if (e.target.checked) {
                setRequestedRoles([
                  ...requestedRoles,
                  "tayyorlovchi",
                ])
              } else {
                setRequestedRoles(
                  requestedRoles.filter(
                    (r) =>
                      r !== "tayyorlovchi"
                  )    
                )
              }
            }}
          />
          Tayyorlovchi
        </label>
 
        <br /><br />

        <button
          onClick={sendWorkerRequest}
        >
          Yuborish
        </button>
      </div>
    ) 
  }


  {/* ===== arxiv ===== */}

  const groupedArchives = {}

  archives.forEach((order) => {

    if (
      !groupedArchives[order.customerId]
    ) {
      groupedArchives[order.customerId] = []
    }

    groupedArchives[order.customerId].push(order)

  })

  if (showArchive) {

    return (
      <div
        style={{ padding: 20 }}
      >
        <button
          onClick={() => setShowArchive(false)}
          style={{fontSize: 20}}
        >
          ⏪️
        </button>

        <h1>Arxiv</h1>

        <br />

        <input
          placeholder="Qidirish"
          value={archiveSearch}
          onChange={(e) => setArchiveSearch(e.target.value)}
        />

        <br /><br />

        {Object.entries(groupedArchives)
          .filter(
            ([customerId, orders]) => {

              const text = archiveSearch.toLowerCase()

              return (
                customerId.toLowerCase().includes(text) ||
                orders[0] .phone.includes(text) ||
                orders.some((o) => String(o.id).includes(text))
              )

            }
          )
           
          .sort(([a], [b]) =>
            Number(a.replace("C", "")) -
            Number(b.replace("C", ""))
          ).map(

          ([customerId, orders]) => (

            <div
              key={customerId}
              style={{
                border: "3px solid #ccc",
                padding: 10,
                marginBottom: 20,
                borderRadius: 10,
              }}
            >

              <p><b>Mijoz ID:</b>{" "}{customerId}</p>
              <p><b>Telefon:</b>{" "}{orders[0].phone}</p>
              <p><b>Buyurtma soni:</b>{" "}{orders.length}</p>
            
              <details>
                <summary>Batafsil</summary>

                {orders.map((order) => (
                  <div
                    key={order.firebaseId}
                    style={{
                      border: "1px solid #aaa",
                      padding: 10,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  >

                    <p><b>Sana:</b>{" "}{order.createdAt && new Date(order.createdAt).toLocaleString()}</p>
                    <p><b>Buyurtma ID:</b>{" "}{order.id}</p>
                    <p><b>Manzil:</b>{" "}{order.address}</p>
                    {order.carpetCount && (<p><b>Gilam:</b> {order.carpetCount}</p>)}
                    {order.kvm && (<p><b>Kv.m:</b> {order.kvm}</p>)}
                    {order.blanket && (<p><b>Adyol:</b> {order.blanket}</p>)}
                    {order.yakandoz && (<p><b>Yakandoz:</b> {order.yakandoz}</p>)}
                    {order.curtainCount && (<p><b>Parda:</b> {order.curtainCount}</p>)}
                    {order.curtainMeter && (<p><b>Parda metri:</b> {order.curtainMeter}</p>)}
                    {order.other && (<p><b>Boshqa:</b> {order.other}</p>)}
                    <p><b>Tarif:</b>{" "}{order.tarif}</p>
                    {order.price && (<p><b>Jami narx:</b> {order.price}</p>)}
                    <p><b>Status:</b>{" "}{order.status}</p>

                  </div>
                ))}
              </details>

            </div>

          ))
        }
      </div>
    )
  }

  if (
    currentWorker &&
    workers.length === 0
  ) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "38vh"
        }}
      >

        <h2>
          Yuklanmoqda...
        </h2>

      </div>
    )
  }

  {/* ===== rolelar ===== */}
  if (
    !role 
  ) {
    return (
      workers.find(
        (w) => w.phone === currentWorker?.phone
      )?.working ||
      currentWorker?.roles?.includes("admin") ||
      currentWorker?.roles?.includes("ega")
      ?(
      <div className="app-container">
        <div className="welcome-card">

          <div className="welcome-title">
            Xush kelibsiz! 👋
          </div>

          <div className="welcome-name">
            {currentWorker?.name}
          </div>

          <div
            style={{
              marginTop: 14,
              color: "#cfd8ff",
              fontSize: 15,
            }}
          >
            O'z ish joyingizni tanlang
          </div>

        </div>

        <div className="roles-grid">  
    
        {(allowedRoles.includes("operator")
          || allowedRoles.includes("admin")
          || allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("operator")}
          >
            <div style={{ fontSize: 42 }}>
              🎧
            </div>

            <div className="role-title">
              Operator
            </div>

            <div className="role-subtitle">
              Buyurtmalarni qabul qilish va boshqarish
            </div>
          </div>
        )}

        {(allowedRoles.includes("driver")
          || allowedRoles.includes("admin")
          || allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("driver")}
          >
            <div style={{ fontSize: 42 }}>
              🚚
            </div>

            <div className="role-title">
              Driver
            </div>

            <div className="role-subtitle">
              Buyurtmalarni yetkazish va statusni yangilash
            </div>
          </div>
        )}

        {(allowedRoles.includes("washer")
          || allowedRoles.includes("admin")
          || allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("washer")}
          >
            <div style={{ fontSize: 42 }}>
              🧼
            </div>

            <div className="role-title">
              Washer
            </div>

            <div className="role-subtitle">
              Gilamlarni yuvish va holatini belgilash
            </div>
          </div>
        )}

        {(allowedRoles.includes("tayyorlovchi")
          || allowedRoles.includes("admin")
          || allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("tayyorlovchi")}
          >
            <div style={{ fontSize: 42 }}>
              📦
            </div>

            <div className="role-title">
              Tayyorlovchi
            </div>

            <div className="role-subtitle">
              Gilamlarni tayyorlash va qadoqlash
            </div>
          </div>
        )}

        {(allowedRoles.includes("admin")
          || allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("admin")}
          >
            <div style={{ fontSize: 42 }}>
              🛡️
            </div>

            <div className="role-title">
              Admin
            </div>

            <div className="role-subtitle">
              Tizimni boshqarish va nazorat qilish
            </div>
          </div>
        )}

        {allowedRoles.includes("ega") && (
          <div
            className="role-card"
            onClick={() => setRole("ega")}
          >
            <div style={{ fontSize: 42 }}>
              👑
            </div>

            <div className="role-title">
              Ega
            </div>

            <div className="role-subtitle">
              Umumiy nazorat va tahlillar
            </div>
          </div>
        )}

        {(allowedRoles.includes("admin") ||
          allowedRoles.includes("ega")
        ) && (
          <div
            className="role-card"
            onClick={() => setShowArchive(!showArchive)}
          >
            <div style={{ fontSize: 42 }}>
              🗂️
            </div>

            <div className="role-title">
              Arxiv
            </div>

            <div className="role-subtitle">
              Arxivlangan buyurtmalar va ma'lumotlar
            </div>
          </div>
        )}

        {(allowedRoles.includes("admin") ||
          allowedRoles.includes("ega")  
        ) && (
          <div
            className="role-card"
            onClick={() => setRole("hisobot")}
          >
            <div style={{ fontSize: 42 }}>
              📊
            </div>

            <div className="role-title">
              Hisobot
            </div>

            <div className="role-subtitle">
              Statistikalar va hisobotlar
            </div>
          </div>
        )}

        <br /><br />

        <hr />
        <hr />
        <hr />

        
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 5,
            border: "3px solid #ff0000",

           }}
        >
          <button onClick={logout}>
            Chiqish
          </button>
        </div>
       
        <hr />

        {!currentWorker?.roles?.includes("admin") &&
          !currentWorker?.roles?.includes("ega") && (
      
          workers.find(
            (w) => w.phone === currentWorker?.phone
          )?.working ? (

            <button
              onClick={stopWork}
            >
              Ishni tugatish
            </button>

          ) : ( 
 
            <button
              onClick={startWork}
            >
              Ishni boshlash
            </button>

          )
        )}
        </div>
      </div>
    ) : (
      <div
        style={{padding: 20}}
      >

        <h3>Sizda ruxsat yo‘q</h3>
        <p>Admin tasdiqlashini kuting</p>

        <button
          onClick={() => {
          setRole("washer")
          setWasherMode("cabinet")
          }}
        >
          Shaxsiy kabinet
        </button>

      </div>
    ))
  }

  return (

  <div style={{ padding: 20 }}>

    {/* ===== operator panel ===== */}
    {role === "operator" && (

      <OperatorPanel

        orders={orders}
        activeOrders={activeOrders}
        finishedOrders={finishedOrders}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        comment={comment}
        setComment={setComment}
        tarif={tarif}
        setTarif={setTarif}
        addOrder={addOrder}
        editingId={editingId}
        setEditingId={setEditingId}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        editAddress={editAddress}
        setEditAddress={setEditAddress}
        editComment={editComment}
        setEditComment={setEditComment}
        deleteOrderId={deleteOrderId}
        setDeleteOrderId={setDeleteOrderId}
        updateStatus={updateStatus}
        setRole={setRole}
        role={role}

      />
      
    )}


    {/* ===== driver panel ===== */}
    {role === "driver" && (
      <DriverPanel

        orders={orders}
        driverMode={driverMode}
        setDriverMode={setDriverMode}
        updateStatus={updateStatus}
        saveDetails={saveDetails}
        setRole={setRole}
        carpetCount={carpetCount}
        setCarpetCount={setCarpetCount}
        kvm={kvm}
        setKvm={setKvm}
        blanket={blanket}
        setBlanket={setBlanket}
        yakandoz={yakandoz}
        setYakandoz={setYakandoz}
        curtainCount={curtainCount}
        setCurtainCount={setCurtainCount}
        curtainMeter={curtainMeter}
        setCurtainMeter={setCurtainMeter}
        curtainPrice={curtainPrice}
        setCurtainPrice={setCurtainPrice}
        other={other}
        setOther={setOther}
        price={price}
        setPrice={setPrice}
        driverComment={driverComment}
        setDriverComment={setDriverComment}

      />
    )}


    {/* ===== washer panel ===== */}
    {role === "washer" && (
      <WasherPanel

        orders={orders}

        allowedRoles={allowedRoles}
        washerMode={washerMode}
        setWasherMode={setWasherMode}  
        updateWashStatus={updateWashStatus}
        currentWorker={currentWorker}
        workers={workers}
        getSalary={getSalary}
        getHours={getHours}
        getCount={getCount}
        washerPrices={washerPrices}
        setRole={setRole}  
        logout={logout}
        todayOpen={todayOpen}
        setTodayOpen={setTodayOpen}
        weekOpen={weekOpen}
        setWeekOpen={setWeekOpen}
        MonthOpen={MonthOpen}
        setMonthOpen={setMonthOpen}
        allOpen={allOpen}
        setAllOpen={setAllOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
  
      />
    )}


    {/* ===== tayyorlovchi panel ===== */}
    {role === "tayyorlovchi" && (
    <div>
      <h1>Tayyorlovchi panel</h1>

      <button
        onClick={() => setRole("")}
        style={{fontSize: 20}} 
      >
        ⏪️
      </button>

      <br /><br />

      <hr />

      <h2>Yuvilgan buyurtmalar</h2>

      {orders
        .filter(
          (o) => o.status === "Yuvildi"
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
                  "Tayyor"
                )
              }
               style={{
                    padding: 3,
                    marginRight: 10,
                    marginTop: 20,
                    background: "yellow",
                    color: "black",
                  }}
            >
              Tayyor
            </button>
          </div>
        ))
      }
    </div>
    )}


    {/* ===== admin panel ===== */}
    {role === "admin" && (
    
      <AdminPanel

        workers={workers}
        workerRequests={workerRequests}
        approveWorker={approveWorker}
        rejectWorker={rejectWorker}
        editingWorker={editingWorker}
        setEditingWorker={setEditingWorker}
        changeWorkerRole={changeWorkerRole}
        changeWorkerStatus={changeWorkerStatus}
        washerPrices={washerPrices}
        setWasherPrices={setWasherPrices}
        priceInputs={priceInputs}
        setPriceInputs={setPriceInputs}
        savePrices={savePrices}
        attendance={attendance}
        getSalary={getSalary}
        getHours={getHours}
        getCount={getCount}
        todayOpen={todayOpen}
        setTodayOpen={setTodayOpen}
        weekOpen={weekOpen}
        setWeekOpen={setWeekOpen}
        MonthOpen={MonthOpen}
        setMonthOpen={setMonthOpen}
        allOpen={allOpen}
        setAllOpen={setAllOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        driverPrices={driverPrices}
        tayyorlovchiPrices={tayyorlovchiPrices}
        getHourlyPrice={getHourlyPrice}
        setRole={setRole}
        editingStatus={editingStatus}
        setEditingStatus={setEditingStatus}
        expandedWorker={expandedWorker}
        setExpandedWorker={setExpandedWorker}
        orders={orders}
        setOrders={setOrders}
        allowedRoles={allowedRoles}
        setAllowedRoles={setAllowedRoles}
        stopWork={stopWork}

      />
    )}

    {/* ===== ega panel ===== */}
    {role === "ega"  && (
    
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

        <p>Driver soatbay</p>

        <input 
          value={driverPrices.hour || "" }
 
          onChange={(e) =>
            setDriverPrices({...driverPrices, hour: e.target.value,})
          }
        />

        <p>Tayyorlovchi soatbay</p>

        <input
          value={tayyorlovchiPrices.hour || "" }

          onChange={(e) =>
            setTayyorlovchiPrices({...tayyorlovchiPrices, hour: e.target.value,})
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
    )}


    {/* ===== hisobot panel ===== */}
    {role === "hisobot" && (

      <div
        style={{
          padding: 20,
          color: "white"
        }}
      >

        <button onClick={() => setRole("")}
          style={{fontSize: 25,}}>
          {"⏪️"}
        </button>

        <h1>📊 Hisobot</h1>

        <br /> 

        <div
          style={{
            border: "2px solid #555",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15
          }}
        >

          <h3>
            Yakunlangan buyurtmalar:
          </h3>

          <h2>
            {todayArchives.length} ta
          </h2>
    
        </div>

        <div
          style={{
            border: "2px solid #555",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15
          }}
        >

          <h3>
            Tushum:
          </h3> 

          <h2>
            {dailyIncome.toLocaleString()}
            so'm
          </h2>

        </div>

        <div
          style={{
            border: "2px solid #555",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15
          }}
        >

          <h3>
            Ishchilar maoshi:
          </h3>

          <h2>
            {totalDailySalary.toLocaleString()}
            so'm
          </h2>

        </div>

      </div>

    )}


  </div>
  )
}

export default App