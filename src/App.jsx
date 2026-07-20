import WasherPanel from "./components/WasherPanel"
import DriverPanel from "./components/DriverPanel"
import OperatorPanel from "./components/OperatorPanel"
import AdminPanel from "./components/AdminPanel"
import getCount from "./utils/getCount"
import getHours from "./utils/getHours"
import getSalary from "./utils/getSalary"
import getAttendanceSalary from "./utils/getAttendanceSalary"
import EgaPanel from "./components/EgaPanel";
import TeamsPanel from "./components/TeamsPanel/TeamsPanel";
import BottomNavigation from "./components/BottomNavigation";
import "./App.css";
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
  getDocs,
  setDoc,
  increment,
  limit,
  documentId,
  orderBy,
} from "firebase/firestore";

function App() {
  const [orders, setOrders] = useState([])
  const [role, setRole] = useState("")
  const [driverMode, setDriverMode] = useState("") 
  const [washerMode, setWasherMode] = useState("")
  const [carpetCount, setCarpetCount] = useState("")
  const [kvm, setKvm] = useState("")
  const [blanketCount, setBlanketCount] = useState("")
  const [yakandozCount, setYakandozCount] = useState("")
  const [curtainCount, setCurtainCount] = useState("")
  const [curtainMeter, setCurtainMeter] = useState("")
  const [curtainPrice, setCurtainPrice] = useState("")
  const [other, setOther] = useState("")
  const [price, setPrice] = useState("")
  const [workerName, setWorkerName] = useState("")
  const [workerPhone, setWorkerPhone] = useState("")
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
  const [packingPrices, setPackingPrices] = useState({})
  const [tarif, setTarif] = useState("standart")
  const [driverComment, setDriverComment] = useState("")
  const [archives, setArchives] = useState([])
  const [archiveSearch, setArchiveSearch] = useState("")
  const [workerEarnings, setWorkerEarnings] = useState({})
  const [teams, setTeams] = useState([])
  const [teamEarnings, setTeamEarnings] = useState({})
  const [page, setPage] = useState("home");
  const [stats, setStats] = useState({
    income: 0,
    salary: 0,
    expenseFund: 0,
    profit: 0,
  });

  const tg = window.Telegram?.WebApp
  const currentPhone = currentWorker?.phone;


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

      await addDoc(
        collection(db, "workerRequests"),
        { 
          name: workerName,
          phone: workerPhone,
          role: "worker",
          telegramId,
          status: "pending",
          createdAt: serverTimestamp(),
        }
      )

      setRequestSent(true)

      setWorkerName("")
      setWorkerPhone("")
  }

  const approveWorker =
    async (request) => {

    await addDoc(
      collection(db, "workers"),
      {
        name: request.name,
        phone: request.phone,
        telegramId: request.telegramId,
        role: "worker",
        approved: true,
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
      telegramId: tg?.initDataUnsafe?.user?.id || null
    }

    setCurrentWorker(updatedWorker)
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

    const activeWorker = workerData || currentWorker

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

    const workerDoc =
      workers.find(
        (w) =>
          w.phone ===
          activeWorker.phone
      )

    if (!workerDoc) return

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

    const hourlyRate = getHourlyPrice(workerDoc)
    const salary = Number(totalHours) * Number(hourlyRate)

    await addDoc(
      collection(db, "attendance"),
      {
        workerName: workerDoc.name,
        workerPhone: workerDoc.phone,
        primaryRole: workerDoc.primaryRole,
        startedAt,
        endedAt,
        totalHours: Number(totalHours),
        hourlyRate,
        salary,
        createdAt: serverTimestamp(),
      }
    )

    await updateDoc(
      workerRef,
      {
        working: false,
        status: "nofaol",
        startedAt: null
      }
    )

  }

  const changeWorkerStatus =  async (
    workerId,
    newStatus
  ) => {
      if (newStatus === "nofaol") {
        const worker = workers.find(
          (w) => w.firebaseId === workerId
        )

        if (worker) {await stopWork(worker)}

        return
      }

    const workerRef =
      doc(
        db,
        "workers",
        workerId
      )

    const workerDoc = workers.find(
      (w) => w.firebaseId === workerId
    )

    if (
      newStatus === "faol" &&
      workerDoc?.working
    ) {
      return
    }

    await updateDoc(
      workerRef,
      {
        status: newStatus,
        working: newStatus === "faol",
        startedAt: newStatus === "faol" ? new Date() : null
      }
    )
  }

  const getHourlyPrice = (
    worker
  ) => {

    if (
      worker.primaryRole ===
      "driver"
    ) {
      return driverPrices.hour || 0
    }

    if (
      worker.primaryRole ===
      "tayyorlovchi"
    ) {
      return packingPrices.hour || 0
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

  const washerTeam = teams.find(
    (team) =>
    team.type === "washer" &&
    currentWorker &&
    team.members?.[currentPhone]
  );


  const driverTeam = teams.find(
    (team) =>
    team.type === "driver" &&
    currentWorker &&
    team.members?.[currentPhone]
  );

  const packingTeam = teams.find(
    (team) =>
      team.type === "packing" &&
      currentWorker &&
      team.members?.[currentPhone]
  );

  const operatorTeam = teams.find(
    (team) =>
      team.type === "operator" &&
      currentWorker &&
      team.members?.[currentPhone]
  );

  const washerMember = washerTeam?.members?.[currentPhone];
  const driverMember = driverTeam?.members?.[currentPhone];
  const packingMember = packingTeam?.members?.[currentPhone];
  const operatorMember = operatorTeam?.members?.[currentPhone];
  const operatorEnabled = !!operatorTeam && operatorMember?.working;
  const driverEnabled = !!driverTeam && driverMember?.working;
  const washerEnabled = !!washerTeam && washerMember?.working;
  const packingEnabled = !!packingTeam && packingMember?.working;

  const totalDailySalary = dailyWasherSalary + dailyHourlySalary


  const addWorkerEarnings = async ({
    dateId,
    members,
    service,
    teamId,
    teamName,
    teamType,
    stage = null,
  }) => {

    const earningsRef = doc(
      db,
      "workerEarnings",
      dateId
    );

    const earningsSnap = await getDoc(earningsRef);

    let earningsData = {};

    if (earningsSnap.exists()) {
      earningsData = earningsSnap.data();
    }

    let teamSalary = 0;

    let activeMembers = members.filter(
      (m) => m.working
    );

    for (const member of members) {

      let earned = 0;

      if (teamType === "washer") {

        earned = Number(member[service.key] || 0) * Number(service.quantity || 0);

      }

      else if (teamType === "driver") {

        if (!member.working) continue;

        const total = Number(service.amount || 0) * Number(service.quantity || 0);

        if (activeMembers.length === 1) {
          earned = total;
        } else {
          earned =
            member.rank === "leader"
            ? total * 0.55
            : total * 0.45;
        } 

      }

      else if (teamType === "packing") {

        if (!member.working) continue;

        if (activeMembers.length === 0) continue;

        const total = Number(service.amount || 0) * Number(service.quantity || 0);

        earned = total / activeMembers.length;

       }

      teamSalary += earned;

      const oldWorker = earningsData[member.phone] || {
        name: member.name,
        washerSalary: 0,
        driverSalary: 0,
        packingSalary: 0,
      };

      earningsData[member.phone] = {
        ...oldWorker,
        name: member.name,

        washerSalary:
          teamType === "washer"
          ? oldWorker.washerSalary + earned
          : oldWorker.washerSalary,  
 
        driverSalary:
          teamType === "driver"
          ? oldWorker.driverSalary + earned
          : oldWorker.driverSalary,

        packingSalary:
          teamType === "packing"
          ? oldWorker.packingSalary + earned
          : oldWorker.packingSalary,
      };

    }

    await setDoc(
      earningsRef, 
      earningsData 
    );

    const teamRef = doc(
      db,
      "teamEarnings",
      dateId
    );

    const teamSnap = await getDoc(teamRef);

    let teamData = {};

    if (teamSnap.exists()) {
      teamData = teamSnap.data();
    }

    let oldTeam = teamData[teamId];

    if (!oldTeam) {
      if (teamType === "driver") {
        oldTeam = {
          type: "driver",
          teamName,
     
          pickupSalary: 0,
          deliverySalary: 0,
          salary: 0,

          pickupCarpetKvm: 0,
          pickupBlanketCount: 0,
          pickupYakandozCount: 0,
          pickupCurtainMeter: 0,
  
          pickupCarpetSalary: 0,
          pickupBlanketSalary: 0,
          pickupYakandozSalary: 0,
          pickupCurtainSalary: 0,

          deliveryCarpetKvm: 0,
          deliveryBlanketCount: 0,
          deliveryYakandozCount: 0,
          deliveryCurtainMeter: 0,

          deliveryCarpetSalary: 0,
          deliveryBlanketSalary: 0,
          deliveryYakandozSalary: 0,
          deliveryCurtainSalary: 0,
        };
      } else {
        oldTeam = {
          type: teamType,
          teamName,

          salary: 0,

          carpetKvm: 0,
          blanketCount: 0,
          yakandozCount: 0,
          curtainMeter: 0,

          carpetSalary: 0,
          blanketSalary: 0,
          yakandozSalary: 0,
          curtainSalary: 0,
        };
      }
    }

    const field = (name) => {
      if (teamType !== "driver") return name;

      return stage + name.charAt(0).toUpperCase() + name.slice(1);
    };

    const addValue = (name, value) => {
      const key = field(name);

      return (oldTeam[key] || 0) + Number(value || 0);
    };

    teamData[teamId] = {
      ...oldTeam,
      type: teamType,
      teamName,

      salary: Number(oldTeam.salary || 0) + teamSalary,

      [field("carpetKvm")] : addValue(
        "carpetKvm",
        service.key === "carpet" ? Number(service.quantity || 0) : 0
      ),

      [field("blanketCount")] : addValue(
        "blanketCount",
        service.key === "blanket" ? Number(service.quantity || 0) : 0
      ),

      [field("yakandozCount")] : addValue(
        "yakandozCount",
        service.key === "yakandoz" ? Number(service.quantity || 0) : 0
      ),

      [field("curtainMeter")] : addValue(
        "curtainMeter",
        service.key === "curtain" ? Number(service.quantity || 0) : 0
      ),

      [field("carpetSalary")] : addValue(
        "carpetSalary",
        service.key === "carpet" ? teamSalary : 0
      ),

      [field("blanketSalary")] : addValue(
        "blanketSalary",
        service.key === "blanket" ? teamSalary : 0
      ),

      [field("yakandozSalary")] : addValue(
        "yakandozSalary",
        service.key === "yakandoz" ? teamSalary : 0
      ),

      [field("curtainSalary")] : addValue(
        "curtainSalary",
        service.key === "curtain" ? teamSalary : 0
      ),

      ...(teamType === "driver" && {
        pickupSalary:
        Number(oldTeam.pickupSalary || 0) +
        (stage === "pickup" ? teamSalary : 0),

        deliverySalary:
        Number(oldTeam.deliverySalary || 0) +
        (stage === "delivery" ? teamSalary : 0),
      }),
    };

    await setDoc(teamRef, teamData);

  };


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

      const worker = JSON.parse(savedWorker)

      setCurrentWorker(worker)
      setRole("")
    
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

    const unsubscribe =
      onSnapshot(
        collection(db, "workerEarnings"),
        (snapshot) => {

          const data = {}

          snapshot.docs.forEach((doc) => {
            data[doc.id] = doc.data()
          })

          setWorkerEarnings(data)
        }
      )

    return () => unsubscribe()

  }, [])


  useEffect(() => {

    const today = new Date().toISOString().slice(0, 10);

    const unsubscribe = onSnapshot(

      doc(db, "teamEarnings", today),

      (snap) => {
        setTeamEarnings(snap.data() || {});
      }

    );

    return () => unsubscribe();

  }, []);


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
        "packingPrices"
      ),

      (snapshot) => {setPackingPrices(snapshot.data() || {})}

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

  useEffect(() => {
    return onSnapshot(
      collection(db, "teams"),
      (snapshot) => {
        setTeams(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      }
    )
  }, [])


  {/* ===== statistikaga tegishli ===== */}
  useEffect(() => {
    if (page === "stats") {
      loadTodayStats();
    }
  }, [page]);


  async function ensureExpenseDocument() {

    const now = new Date();

    const today = `${now.getFullYear()}-${
      String(now.getMonth() + 1).padStart(2, "0")
    }-${
      String(now.getDate()).padStart(2, "0")
    }`;

    const expenseRef = doc(db, "expenses", today);
 
    const expenseSnap = await getDoc(expenseRef);

    if (expenseSnap.exists()) {
      return expenseRef;
    }

    let openingFund = 0;

    const lastExpenseQuery = query(
      collection(db, "expenses"),
      orderBy(documentId(), "desc"),
      limit(1)
    );

    const lastExpenseSnap = await getDocs(lastExpenseQuery);

    if (!lastExpenseSnap.empty) {
      openingFund = Number(lastExpenseSnap.docs[0].data().remainingFund || 0);
    }

    await setDoc(expenseRef, {
      openingFund,
      earnedToday: 0,
      spentToday: 0,
      currentFund: openingFund,
      remainingFund: openingFund,
      createdAt: serverTimestamp(),
    });

    return expenseRef;

  }


  async function updateExpenseFund(order) {

    const carpet = Number(order.kvm || 0) * 3000;
    const blanket = Number(order.blanketCount || 0) * 15000;
    const yakandoz = Number(order.yakandozCount || 0) * 15000;
    const curtain = Number(order.curtainMeter || 0) * 3000;
    const earnedToday = carpet + blanket + yakandoz + curtain;

    const expenseRef = await ensureExpenseDocument()

    await updateDoc(expenseRef, {
      earnedToday: increment(earnedToday),
      currentFund: increment(earnedToday),
      remainingFund: increment(earnedToday),
    });

  }


  async function addExpense({
    category,
    amount,
    note,
  }) {

    const expenseRef = ensureExpenseDocument()

    await addDoc(
      collection(expenseRef,"items"),
      {
        category,
        amount:Number(amount),
        note,
        createdAt:serverTimestamp(),
        worker:currentWorker.phone
      }
    );

    await updateDoc(expenseRef,{
      spentToday:increment(Number(amount)),
      remainingFund:increment(-Number(amount))
    });

  }


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

      await setDoc(
        doc(
          db, "customers", customerId
        ), {
          customerId,
          phone,
          address,
          ordersCount: 1,
          createdAt: serverTimestamp(),
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
      driverNotified: false,
      washerNotified: false,
      createdAt: serverTimestamp()
    }

    await setDoc(
      doc(db, "orders", orderId),
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

    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) return;

    const order = orderSnap.data();

    const updates = {
      status: status,
    }

    if (status === "Yetkazilmoqda") {
      updates.deliveryDriverTeamId = driverTeam?.id;
      updates.deliveryDriverTeamName = driverTeam?.teamName;
    }

    if (status === "Yetkazildi") { 

      const order = orders.find((o) => o.firebaseId === id)

      const deliveryTeam = teams.find(
        (team) => team.id === order.deliveryDriverTeamId
      );

      const dateId = new Date().toISOString().slice(0, 10);

      if (deliveryTeam) {

        const members = Object.values(deliveryTeam.members);

        const driverServices = [
          {
            key: "carpet",
            amount: Number(driverPrices.deliveryCarpet || 0),
            quantity: Number(order.kvm || 0),
          },
          {
            key: "blanket",
            amount: Number(driverPrices.deliveryBlanket || 0),
            quantity: Number(order.blanketCount || 0),
          },
          {
            key: "yakandoz",
            amount: Number(driverPrices.deliveryYakandoz || 0),
            quantity: Number(order.yakandozCount || 0),
          },
          {
            key: "curtain",
            amount: Number(driverPrices.deliveryCurtain || 0),
            quantity: Number(order.curtainMeter || 0),
          },
        ];

        for (const service of driverServices) {
          if (service.quantity <= 0) continue;

          await addWorkerEarnings({
            dateId,
            members,
            service,
            teamId: deliveryTeam.id,
            teamName: deliveryTeam.teamName,
            teamType: "driver",
            stage: "delivery",
          });
        }
      }

      await setDoc(
        doc(
          db, "archives", order.id
        ),{
          ...order,
          status: "Yetkazildi",
          archivedAt: serverTimestamp(),
          archiveDate: today
        }
      );

      await updateExpenseFund(order);

      await deleteDoc(orderRef);

      return
    }

    if (status === "Tayyor") {

      const packingTeam = teams.find(
        (team) =>
        team.type === "packing" &&
        currentWorker &&
        team.members?.[currentPhone]
      );

      updates.packingTeamId = packingTeam?.id;
      updates.packingTeamName = packingTeam?.teamName;

      const dateId = new Date().toISOString().slice(0, 10);

      if (packingTeam) {

        const members = Object.values(packingTeam.members);

        const packingServices = [
          {
            key: "carpet",
            amount: Number(packingPrices.carpet || 0),
            quantity: Number(order.kvm || 0),
          },
          {
            key: "blanket",
            amount: Number(packingPrices.blanket || 0),
            quantity: Number(order.blanketCount || 0),
          },
          {
            key: "yakandoz",
            amount: Number(packingPrices.yakandoz || 0),
            quantity: Number(order.yakandozCount || 0),
          },
          {
            key: "curtain",
            amount: Number(packingPrices.curtain || 0),
            quantity: Number(order.curtainMeter || 0),
          },
        ];

        for (const service of packingServices) {
          if (service.quantity <= 0) continue;
 
          await addWorkerEarnings({
            dateId,
            members,
            service,
            teamId: packingTeam.id,
            teamName: packingTeam.teamName,
            teamType: "packing",
          });
        }
      }

    }

    if (status === "Olindi") {

      const pickupTeam = teams.find(
        (team) => team.id === order.pickupDriverTeamId
      );

      const dateId = new Date().toISOString().slice(0, 10);

      if (pickupTeam) {

        const members = Object.values(pickupTeam.members);

        const driverServices = [
          {
            key: "carpet",
            amount: Number(driverPrices.pickupCarpet || 0),
            quantity: Number(order.kvm || 0),
          },
          {  
            key: "blanket",
            amount: Number(driverPrices.pickupBlanket || 0),
            quantity: Number(order.blanketCount || 0),
          },
          {
            key: "yakandoz",
            amount: Number(driverPrices.pickupYakandoz || 0),
            quantity: Number(order.yakandozCount || 0),
          },
          {
            key: "curtain",
            amount: Number(driverPrices.pickupCurtain || 0),
            quantity: Number(order.curtainMeter || 0),
          },
        ];

        for (const service of driverServices) {
          if (service.quantity <= 0) continue;

          await addWorkerEarnings({
            dateId,
            members,
            service,
            teamId: pickupTeam.id,
            teamName: pickupTeam.teamName,
            teamType: "driver",
            stage: "pickup"
          });
        }
      }

    }

    if (status === "Olinmoqda" ) {
      updates.pickupDriverTeamId = driverTeam?.id;
      updates.pickupDriverTeamName = driverTeam?.teamName;
    }
 
    await updateDoc(
      orderRef,
      updates
    )
  }

  {/* ===== save detail ===== */}
  const saveDetails = async (id) => {
    const orderRef = doc(db, "orders", id)

    await updateDoc(orderRef, {
      carpetCount,
      kvm,
      blanketCount,
      yakandozCount,
      curtainCount,
      curtainMeter,
      curtainPrice,
      other,
      driverComment,
      price,
      carpetStatus: carpetCount
        ? "Kutmoqda"
        : "",
   
      blanketStatus: blanketCount
        ? "Kutmoqda"
        : "",

      yakandozStatus: yakandozCount || other
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

    const team = teams.find(team =>
      team.type === "washer" &&
      team.members?.[currentWorker.phone]
    );

    if (value === "Yuvilmoqda" && team) {

      if (field === "carpetStatus") {
        updates.carpetWasherTeamId = team.id;
        updates.carpetWasherTeamName = team.teamName;
      }

      if (field === "blanketStatus") {
        updates.blanketWasherTeamId = team.id;
        updates.blanketWasherTeamName = team.teamName;
      }

      if (field === "yakandozStatus") {
        updates.yakandozWasherTeamId = team.id;
        updates.yakandozWasherTeamName = team.teamName;
      }

      if (field === "curtainStatus") {
        updates.curtainWasherTeamId = team.id;
        updates.curtainWasherTeamName = team.teamName;
      }

    }

    if (
      value === "Yuvildi" && currentWorker
    ) {

      updates[field.replace(
        "Status",
        "Date"
      )] = serverTimestamp() 

      const serviceMap = {
        carpetStatus: {
          key: "carpet",
          amount: Number(team.members[currentWorker.phone].carpet || 0),
          quantity: Number(order.kvm || 0),
        },

        blanketStatus: {
          key: "blanket",
          amount: Number(team.members[currentWorker.phone].blanket || 0),
          quantity: Number(order.blanketCount || 0),
        },

        yakandozStatus: {
          key: "yakandoz",
          amount: Number(team.members[currentWorker.phone].yakandoz || 0),
          quantity: Number(order.yakandozCount || 0),
        },

        curtainStatus: {
          key: "curtain",
          amount: Number(team.members[currentWorker.phone].curtain || 0),
          quantity: Number(order.curtainMeter || 0),
        },
      };

      const serviceStats = {
        carpet: "carpetKvm",
        blanket: "blanketCount",
        yakandoz: "yakandozCount",
        curtain: "curtainMeter",
      }; 

      const service = serviceMap[field];
      const washerTeam = teams.find((team) => team.id === order[`${service.key}WasherTeamId`]);
      const members = Object.values(washerTeam.members);
      const serviceAmount = service.amount;
      const statField = serviceStats[service.key];
  
      const today = new Date();

      const dateId = today.getFullYear() +
      "-" + String(today.getMonth() + 1).padStart(2, "0") +
      "-" + String(today.getDate()).padStart(2, "0");

      await addWorkerEarnings({
        dateId,
        members,
        service,
        teamId: washerTeam.id,
        teamName: washerTeam.teamName,
        teamType: "washer"
      });

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
  if (!currentWorker && !requestSent ) {
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

  if (!currentWorker) {

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

        <button
          onClick={sendWorkerRequest}
        >
          Yuborish
        </button>
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


  {/* ===== statistikaga tegishli ===== */}
  function InfoCard({
    icon,
    title,
    value,
    suffix = "",
  }) {
    return (
      <div className="info-card">
        <div className="info-card-icon">{icon}</div>

        <div className="info-card-title">
          {title}
        </div>

        <div className="info-card-value">
          {value}
          {suffix && (
            <span className="info-card-suffix">
              {" "}
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }


  {/* ===== statistikaga tegishli ===== */}
  async function loadTodayStats() {

    const now = new Date();

    const today = `${now.getFullYear()}-${
      String(now.getMonth()+1).padStart(2,"0")
    }-${
      String(now.getDate()).padStart(2,"0")
    }`;

    const archiveQuery = query(
      collection(db, "archives"),
      where("archiveDate", "==", today)
    );

    const archiveSnap = await getDocs(archiveQuery);

    let income = 0;

    archiveSnap.forEach((doc) => {

      const order = doc.data();

      income += Number(order.price || 0);

    });

    setStats(prev => ({
      ...prev,
      income,
    }));

  }


  return (

  <div style={{ padding: 17 }}>

      {/* ===== rolelar ===== */}
    {!role && page === "home" && (
      
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

          <div
            className={`role-card ${driverEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (driverEnabled) {setRole("driver");}
            }}
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

          <div
            className={`role-card ${washerEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (washerEnabled) {setRole("washer");}
            }}
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

          <div
            className={`role-card ${packingEnabled ? "" : "role-disabled"}`}
            onClick={() => {
              if (packingEnabled) {setRole("tayyorlovchi");}
            }}
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

        {(currentWorker?.roles?.includes("admin")
          || currentWorker?.roles?.includes("ega")
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

        {currentWorker?.roles?.includes("ega") && (
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
              onClick={() => stopWork()}
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
      )
    }


    {/* ===== statistika =====  */}
    {page === "stats" && (

      <div className="stats-cards">

        <InfoCard
          icon="💰"
          title="Jami tushum"
          value={stats.income}
          suffix="so'm"
        />

        <InfoCard
          icon="👷"
          title="Jami ish haqi"
          value={stats.salary}
          suffix="so'm"
        />

        <InfoCard
          icon="💸"
          title="Chiqim fondi"
          value={stats.expenseFund}
          suffix="so'm"
        />

        <InfoCard
          icon="💵"
          title="Sof foyda"
          value={stats.profit}
          suffix="so'm"
        />

      </div>

    )}


    {/* ===== operator panel ===== */}
    {page === "home" && role === "operator" && (

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
    {page === "home" && role === "driver" && (
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
        blanketCount={blanketCount}
        setBlanketCount={setBlanketCount}
        yakandozCount={yakandozCount}
        setYakandozCount={setYakandozCount}
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
        currentWorker={currentWorker}
        driverTeam={driverTeam}

      />
    )}


    {/* ===== washer panel ===== */}
    {page === "home" && role === "washer" && (
      <WasherPanel

        orders={orders}
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
        workerEarnings={workerEarnings}
        attendance={attendance}
        teams={teams}
        washerTeam={washerTeam}
  
      />
    )}


    {/* ===== tayyorlovchi panel ===== */}
    {page === "home" && role === "tayyorlovchi" && (
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
              {order.blanketCount && (<p><b>Adyol:</b> {order.blanketCount}</p>)}
              {order.yakandozCount && (<p><b>Yakandoz:</b> {order.yakandozCount}</p>)}
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
    {page === "home" && role === "admin" && (
    
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
        getHourlyPrice={getHourlyPrice}
        setRole={setRole}
        editingStatus={editingStatus}
        setEditingStatus={setEditingStatus}
        expandedWorker={expandedWorker}
        setExpandedWorker={setExpandedWorker}
        orders={orders}
        setOrders={setOrders}
        getAttendanceSalary={getAttendanceSalary}
        workerEarnings={workerEarnings}
        currentWorker={currentWorker}

      />
    )}

    {/* ===== ega panel ===== */}
    {page === "home" && role === "ega"  && (
    
      <EgaPanel
        setRole={setRole}

        priceInputs={priceInputs}
        setPriceInputs={setPriceInputs}

        driverPrices={driverPrices}
        setDriverPrices={setDriverPrices}

        packingPrices={packingPrices}
        setPackingPrices={setPackingPrices}

      />  

    )}

    {/* ===== teams panel ===== */}
    {page === "teams" && (
      <TeamsPanel
        teams={teams}
        setTeams={setTeams}
        workers={workers}
        currentWorker={currentWorker}
        setPage={setPage}
        role={currentWorker?.role} 
        teamEarnings={teamEarnings}
        driverPrices={driverPrices}
        packingPrices={packingPrices}
        washerPrices={washerPrices}

      />
    )}

    <BottomNavigation
      page={page}
      setPage={setPage}
      currentWorker={currentWorker}
    />
  </div>
  )
}

export default App

/*   { ===== arxiv ===== }

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
          onClick={() => setPage("home")}
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

                    <p>
                      <b>Sana:</b>{" "}
                      {
                        order.createdAt?.toDate
                        ? order.createdAt
                        .toDate()
                        .toLocaleDateString("uz-UZ")
                        : "-"
                      }
                    </p>
                    <p><b>Buyurtma ID:</b>{" "}{order.id}</p>
                    <p><b>Manzil:</b>{" "}{order.address}</p>
                    {order.carpetCount && (<p><b>Gilam:</b> {order.carpetCount}</p>)}
                    {order.kvm && (<p><b>Kv.m:</b> {order.kvm}</p>)}
                    {order.blanketCount && (<p><b>Adyol:</b> {order.blanketCount}</p>)}
                    {order.yakandozCount && (<p><b>Yakandoz:</b> {order.yakandozCount}</p>)}
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
    
       ===== hisobot panel ===== 
    {page === "report" && (

      <div
        style={{
          padding: 20,
          color: "white"
        }}
      >

        <button onClick={() => setPage("home")}
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

    )} */