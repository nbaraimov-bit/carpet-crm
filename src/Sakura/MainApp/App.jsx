import VaqtinchalikOylikChiqim from "./VaqtinchalikOylikChiqim"
import VaqtinchalikHisobot from "./VaqtinchalikHisobot"
import ArchivePage from "../Pages/Archive/ArchivePage"
import HomePage from "../Pages/Home/HomeMain/HomePage"
import WasherPanel from "../Panels/Washer/WasherPanel"
import PackingPanel from "../Panels/Packing/PackingPanel"
import DriverPanel from "../Panels/Driver/DriverPanel"
import OperatorPanel from "../Panels/Operator/OperatorPanel"
import AdminPanel from "../../components/AdminPanel"
import EgaPanel from "../../components/EgaPanel";
import TeamsPanel from "../Pages/Teams/TeamsPanel";
import BottomNavigation from "../BottomNavigation/BottomNavigation";

import logo from "../Pages/Home/Assets/logo.png";
import carpet from "../Pages/Home/Assets/carpet.png";
import operatorIcon from "../Pages/Home/Assets/operatorIcon.png";
import driverIcon from "../Pages/Home/Assets/driverIcon.png";
import washerIcon from "../Pages/Home/Assets/washerIcon.png";
import packingIcon from "../Pages/Home/Assets/packingIcon.png";
import adminIcon from "../Pages/Home/Assets/adminIcon.png";
import egaIcon from "../Pages/Home/Assets/egaIcon.png";
import jamiIcon from "../Pages/Home/Assets/jamiIcon.png";
import yangiIcon from "../Pages/Home/Assets/yangiIcon.png";
import olindiIcon from "../Pages/Home/Assets/olindiIcon.png";
import yuvildiIcon from "../Pages/Home/Assets/yuvildiIcon.png";
import tayyorIcon from "../Pages/Home/Assets/tayyorIcon.png";

import "./App.css";
import { useState, useEffect, useRef } from "react"
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
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
  runTransaction,
} from "firebase/firestore";

function getTodayString() {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const datePart = (type) => dateParts.find((part) => part.type === type)?.value;
  return `${datePart("year")}-${datePart("month")}-${datePart("day")}`;
}

function InfoCard({ icon, title, value, suffix = "" }) {
  return (
    <div className="info-card">
      <div className="info-card-icon">{icon}</div>
      <div className="info-card-title">{title}</div>
      <div className="info-card-value">
        {value}
        {suffix && <span className="info-card-suffix"> {suffix}</span>}
      </div>
    </div>
  );
}

function App() {
  const [orders, setOrders] = useState([])
  const [role, setRole] = useState("")
  const [displayRole, setDisplayRole] = useState("")
  const [roleTransition, setRoleTransition] = useState("")
  const [driverMode, setDriverMode] = useState("") 
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
  const [currentWorker,setCurrentWorker] = useState(() => {
    try {
      const savedWorker = localStorage.getItem("worker");
      return savedWorker ? JSON.parse(savedWorker) : null;
    } catch {
      return null;
    }
  })
  const [workers, setWorkers] = useState([])
  const [washerPrices,setWasherPrices] = useState({})
  const [driverPrices, setDriverPrices] = useState({})
  const [packingPrices, setPackingPrices] = useState({})
  const [driverComment, setDriverComment] = useState("")
  const [teams, setTeams] = useState([])
  const [teamEarnings, setTeamEarnings] = useState({})
  const [page, setPage] = useState("home");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseItems, setExpenseItems] = useState([]);
  const [statsTab, setStatsTab] = useState("stats");
  const [todayWorkers, setTodayWorkers] = useState([]);
  const [loading, setLoading] = useState({});
  const actionLocks = useRef(new Set());
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [stats, setStats] = useState({
    income: 0,
    salary: 0,
    expenseFund: 0,
    profit: 0,
  });
  const [expenseForm, setExpenseForm] = useState({
    category: "",
    amount: "",
    note: "",
  });
  const [expenseStats, setExpenseStats] = useState({
    openingFund: 0,
    earnedToday: 0,
    spentToday: 0,
    remainingFund: 0,
  });
  


  const tg = window.Telegram?.WebApp
  const currentPhone = currentWorker?.phone;


  async function runAction(actionId, callback) {

    if (actionLocks.current.has(actionId)) return;
    actionLocks.current.add(actionId);

    setLoading(prev => ({
      ...prev,
      [actionId]: true,
    }));

    try {  

      await callback();
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (err) {
 
      console.error(err);  
      alert("Xatolik yuz berdi!");

    } finally {

      actionLocks.current.delete(actionId);

      setLoading(prev => ({
        ...prev,
        [actionId]: false,
      }));

    }
  }


  const changeRole = (nextRole) => {
    if (nextRole === role) return

    // Panelga kirish
    if (nextRole) {
      setDisplayRole(nextRole)
      setRoleTransition("role-enter")

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRole(nextRole)
          setRoleTransition("role-enter-active")
        })
      })

      return
    }

    // Paneldan chiqish
    setRoleTransition("role-exit")

    setTimeout(() => {
      setRole("")
      setDisplayRole("")
      setRoleTransition("")
    }, 280)
  }


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

  const approveWorker = async (request) => {
    const requestRef = doc(db, "workerRequests", request.firebaseId);
    const workerRef = doc(collection(db, "workers"));

    await runTransaction(db, async (transaction) => {
      const requestSnapshot = await transaction.get(requestRef);
      if (!requestSnapshot.exists() || requestSnapshot.data().status !== "pending") return;

      transaction.set(workerRef, {
        name: request.name,
        phone: request.phone,
        telegramId: request.telegramId,
        role: "worker",
        approved: true,
      });
      transaction.update(requestRef, { status: "approved" });
    });
  };

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

  const driverTeam = teams.find(
    (team) =>
      team.type === "driver" &&
      team.members?.[currentPhone]?.working === true
  );

  const washerTeam = teams.find(
    (team) =>
      team.type === "washer" &&
      team.members?.[currentPhone]?.working === true
  );

  const packingTeam = teams.find(
    (team) =>
      team.type === "packing" &&
      team.members?.[currentPhone]?.working === true
  );

  const operatorTeam = teams.find(
    (team) =>
      team.type === "operator" &&
      team.members?.[currentPhone]?.working === true
  );

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

        if (!member.working) continue;

        earned = Number(member[service.rateKey || service.key] ?? member[service.key] ?? 0) * Number(service.quantity || 0);

      }

      else if (teamType === "driver") {

        if (!member.working) continue;

        const total = Number(service.amount || 0) * Number(service.quantity || 0);

        const activeLeaders = activeMembers.filter((activeMember) => activeMember.rank === "leader").length;
        const activeNonLeaders = activeMembers.filter((activeMember) => activeMember.rank !== "leader").length;

        if (activeMembers.length === 1) {
          earned = total;
        } else if (activeLeaders === 1 && activeNonLeaders > 0) {
          earned = member.rank === "leader"
            ? total * 0.55
            : (total * 0.45) / activeNonLeaders;
        } else {
          earned = total / activeMembers.length;
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
          ? Number(oldWorker.washerSalary || 0) + earned
          : Number(oldWorker.washerSalary || 0),
 
        driverSalary:
          teamType === "driver"
          ? Number(oldWorker.driverSalary || 0) + earned
          : Number(oldWorker.driverSalary || 0),

        packingSalary:
          teamType === "packing"
          ? Number(oldWorker.packingSalary || 0) + earned
          : Number(oldWorker.packingSalary || 0),
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
    const images = [
      logo,
      carpet,
      operatorIcon,
      driverIcon,
      washerIcon,
      packingIcon,
      adminIcon,
      egaIcon,
      jamiIcon,
      yangiIcon,
      olindiIcon,
      yuvildiIcon,
      tayyorIcon,
    ];

    const promises = images.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
    
        img.onload = resolve;
        img.onerror = resolve;

        img.src = src;
      });
    });

    Promise.all(promises).then(() => {
      setAssetsLoaded(true);
    });
  }, []);


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

    const today = getTodayString();

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
      }
    }

    getPrices()

  }, [])

  useEffect(() => {

    const workerId = currentWorker?.firebaseId;
    const workerRole = currentWorker?.role;
    if (!workerId)
      return

    const unsubscribe = onSnapshot(

      doc(
        db,
        "workers",
        workerId
      ),

      (snapshot) => {

        const data = snapshot.data()

        if (!data) return
         
        if (
          workerRole !== "admin" &&
          workerRole !== "ega" &&
          data.role !== workerRole
        ) {

          localStorage.removeItem("worker")

          window.location.reload()

          return
        }

        setCurrentWorker((worker) => worker ? { ...worker, ...data } : worker)

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

  }, [currentWorker?.firebaseId, currentWorker?.role])

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
      loadTodayWorkers();

      if (statsTab === "expense") {
        loadExpenseFund();
      }
    }
  }, [page, statsTab]); // eslint-disable-line react-hooks/exhaustive-deps


  async function ensureExpenseDocument() {

    const today = getTodayString()

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
      openingFund = Number(
        lastExpenseSnap.docs[0].data().remainingFund || 0
      );
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

    const expenseRef = await ensureExpenseDocument()

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
      currentFund:increment(-Number(amount)),
      remainingFund:increment(-Number(amount))
    });

  }


  function calculateTotalSalary(
    order,
    washerPrices,
    driverPrices,
    packingPrices
  ) {
    let total = 0;

    total += (
      Number(washerPrices.carpet || 0) +
      Number(driverPrices.pickupCarpet || 0) +
      Number(driverPrices.deliveryCarpet || 0) +
      Number(packingPrices.carpet || 0)
    ) * Number(order.kvm || 0);

    total += (
      Number(washerPrices.blanket || 0) +
      Number(driverPrices.pickupBlanket || 0) +
      Number(driverPrices.deliveryBlanket || 0) +
      Number(packingPrices.blanket || 0)
    ) * Number(order.blanketCount || 0);

    total += (
      Number(washerPrices.yakandoz || 0) +
      Number(driverPrices.pickupYakandoz || 0) +
      Number(driverPrices.deliveryYakandoz || 0) +
      Number(packingPrices.yakandoz || 0)
    ) * Number(order.yakandozCount || 0);

    total += (
      Number(washerPrices.curtain || 0) +
      Number(driverPrices.pickupCurtain || 0) +
      Number(driverPrices.deliveryCurtain || 0) +
      Number(packingPrices.curtain || 0)
    ) * Number(order.curtainMeter || 0);

    return total;
  }

  {/* ===== save detail ===== */}


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
        ? "Olindi"
        : "",
   
      blanketStatus: blanketCount
        ? "Olindi"
        : "",

      yakandozStatus: yakandozCount || other
        ? "Olindi"
        : "",

      curtainStatus: curtainMeter
        ? "Olindi"
        : "",
    })

  }

  
  {/* ===== update wash status ===== */}
  const updateWasherStatus = async (id, category) => {
    const orderRef = doc(db, "orders", id);
    const team = teams.find((item) =>
      item.type === "washer" &&
      item.members?.[currentWorker?.phone]?.working === true
    );

    if (!team || !currentWorker?.phone) {
      throw new Error("Faol yuvuvchi jamoa topilmadi");
    }

    const categoryConfig = {
      carpet: {
        statusField: "carpetStatus",
        teamIdField: "carpetWasherTeamId",
        teamNameField: "carpetWasherTeamName",
        dateField: "carpetDate",
        rates: [
          { key: "carpet", rateKey: "carpetSt", legacyRateKey: "carpet", quantity: "kvmSt" },
          { key: "carpet", rateKey: "carpetPro", legacyRateKey: "carpet", quantity: "kvmPro" },
        ],
      },
      blanket: {
        statusField: "blanketStatus",
        teamIdField: "blanketWasherTeamId",
        teamNameField: "blanketWasherTeamName",
        dateField: "blanketDate",
        rates: [
          { key: "blanket", rateKey: "blanket1x", legacyRateKey: "blanket", quantity: "blanket1x" },
          { key: "blanket", rateKey: "blanket2x", legacyRateKey: "blanket", quantity: "blanket2x" },
          { key: "blanket", rateKey: "matras", legacyRateKey: "blanket", quantity: "matras" },
        ],
      },
      yakandoz: {
        statusField: "yakandozStatus",
        teamIdField: "yakandozWasherTeamId",
        teamNameField: "yakandozWasherTeamName",
        dateField: "yakandozDate",
        rates: [
          { key: "yakandoz", rateKey: "yakandozM", legacyRateKey: "yakandoz", quantity: "yakandozM" },
          { key: "yakandoz", rateKey: "yakandozS", legacyRateKey: "yakandoz", quantity: "yakandozS" },
          { key: "yakandoz", rateKey: "yakandozL", legacyRateKey: "yakandoz", quantity: "yakandozL" },
        ],
      },
    };
    const config = categoryConfig[category];
    if (!config) throw new Error("Mahsulot turi noto‘g‘ri");

    const order = await runTransaction(db, async (transaction) => {
      const orderSnapshot = await transaction.get(orderRef);
      if (!orderSnapshot.exists()) throw new Error("Buyurtma topilmadi");
      const latestOrder = orderSnapshot.data();
      if (latestOrder[config.statusField] === "Yuvildi") return null;

      const assignedTeamId = latestOrder[config.teamIdField];
      if (assignedTeamId && assignedTeamId !== team.id) {
        throw new Error("Bu mahsulot boshqa jamoaga biriktirilgan");
      }

      const orderUpdates = {
        [config.statusField]: "Yuvildi",
        [config.teamIdField]: team.id,
        [config.teamNameField]: team.teamName,
        [config.dateField]: serverTimestamp(),
      };
      const categoryFields = [
        { status: "carpetStatus", count: Number(latestOrder.kvmSt || 0) + Number(latestOrder.kvmPro || 0) || Number(latestOrder.kvm || 0) || Number(latestOrder.carpetCount || 0) },
        { status: "blanketStatus", count: Number(latestOrder.blanket1x || 0) + Number(latestOrder.blanket2x || 0) + Number(latestOrder.matras || 0) || Number(latestOrder.blanketCount || 0) },
        { status: "yakandozStatus", count: Number(latestOrder.yakandozM || 0) + Number(latestOrder.yakandozS || 0) + Number(latestOrder.yakandozL || 0) || Number(latestOrder.yakandozCount || 0) },
      ].filter((item) => item.count > 0);
      const allProductsDone = categoryFields.every((item) =>
        item.status === config.statusField || latestOrder[item.status] === "Yuvildi"
      );
      if (allProductsDone) orderUpdates.status = "Yuvildi";
      transaction.update(orderRef, orderUpdates);
      return latestOrder;
    });
    if (!order) return;

    const hasSizeFields = config.rates.some((rate) => Number(order[rate.quantity] || 0) > 0);
    const legacyQuantity = category === "carpet"
      ? Number(order.kvm || 0)
      : Number(order[category === "blanket" ? "blanketCount" : "yakandozCount"] || 0);
    const wageServices = config.rates
      .map((rate) => ({
        key: rate.key,
        rateKey: hasSizeFields ? rate.rateKey : rate.legacyRateKey,
        quantity: hasSizeFields ? Number(order[rate.quantity] || 0) : 0,
      }))
      .filter((service) => service.quantity > 0);

    if (!hasSizeFields && legacyQuantity > 0) {
      wageServices.push({
        key: category,
        rateKey: config.rates[0].legacyRateKey,
        quantity: legacyQuantity,
      });
    }

    const activeMembers = Object.entries(team.members || {})
      .filter(([, member]) => member.working)
      .map(([phone, member]) => ({ ...member, phone: member.phone || phone }));
    for (const service of wageServices) {
      await addWorkerEarnings({
        dateId: getTodayString(),
        members: activeMembers,
        service,
        teamId: team.id,
        teamName: team.teamName,
        teamType: "washer",
      });
    }
  };

  const updatePackingStatus = async (id, category) => {
    const productConfig = {
      carpet: { statusField: "carpetStatus" },
      blanket: { statusField: "blanketStatus" },
      yakandoz: { statusField: "yakandozStatus" },
    };
    const config = productConfig[category];
    if (!config) throw new Error("Mahsulot turi noto'g'ri");

    const team = teams.find((item) =>
      item.type === "packing" && item.members?.[currentPhone]?.working === true
    );
    if (!team || !currentPhone) throw new Error("Faol tayyorlovchi jamoa topilmadi");

    const orderRef = doc(db, "orders", id);
    const order = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(orderRef);
      if (!snapshot.exists()) throw new Error("Buyurtma topilmadi");
      const latestOrder = snapshot.data();
      if (latestOrder[config.statusField] === "Tayyor") return null;
      if (latestOrder[config.statusField] !== "Yuvildi") {
        throw new Error("Mahsulot hali yuvilmagan");
      }
      if (latestOrder.packingTeamId && latestOrder.packingTeamId !== team.id) {
        throw new Error("Bu buyurtma boshqa tayyorlovchi jamoaga biriktirilgan");
      }

      const updates = {
        [config.statusField]: "Tayyor",
        packingTeamId: team.id,
        packingTeamName: team.teamName,
      };
      const presentProducts = [
        { category: "carpet", statusField: "carpetStatus", count: Number(latestOrder.kvmSt || 0) + Number(latestOrder.kvmPro || 0) || Number(latestOrder.kvm || 0) || Number(latestOrder.carpetCount || 0) },
        { category: "blanket", statusField: "blanketStatus", count: Number(latestOrder.blanket1x || 0) + Number(latestOrder.blanket2x || 0) + Number(latestOrder.matras || 0) || Number(latestOrder.blanketCount || 0) },
        { category: "yakandoz", statusField: "yakandozStatus", count: Number(latestOrder.yakandozM || 0) + Number(latestOrder.yakandozS || 0) + Number(latestOrder.yakandozL || 0) || Number(latestOrder.yakandozCount || 0) },
      ].filter((product) => product.count > 0);
      const allPrepared = presentProducts.length > 0 && presentProducts.every((product) =>
        product.category === category || latestOrder[product.statusField] === "Tayyor"
      );
      if (allPrepared) updates.status = "Tayyor";

      transaction.update(orderRef, updates);
      return latestOrder;
    });

    if (!order) return;

    const members = Object.entries(team.members || {}).map(([phone, member]) => ({
      ...member,
      phone: member.phone || phone,
    }));
    let services;
    if (category === "carpet") {
      const hasSizeFields = Number(order.kvmSt || 0) + Number(order.kvmPro || 0) > 0;
      services = [{ key: "carpet", amount: 300, quantity: hasSizeFields
        ? Number(order.kvmSt || 0) + Number(order.kvmPro || 0)
        : Number(order.kvm || 0) }];
    } else if (category === "blanket") {
      const hasSizeFields = Number(order.blanket1x || 0) + Number(order.blanket2x || 0) + Number(order.matras || 0) > 0;
      services = hasSizeFields
        ? [
            { key: "blanket", amount: 800, quantity: Number(order.blanket1x || 0) },
            { key: "blanket", amount: 1000, quantity: Number(order.blanket2x || 0) },
            { key: "blanket", amount: 2000, quantity: Number(order.matras || 0) },
          ]
        : [{ key: "blanket", amount: 800, quantity: Number(order.blanketCount || 0) }];
    } else {
      const hasSizeFields = Number(order.yakandozM || 0) + Number(order.yakandozS || 0) + Number(order.yakandozL || 0) > 0;
      services = hasSizeFields
        ? [
            { key: "yakandoz", amount: 500, quantity: Number(order.yakandozM || 0) },
            { key: "yakandoz", amount: 1000, quantity: Number(order.yakandozS || 0) },
            { key: "yakandoz", amount: 1500, quantity: Number(order.yakandozL || 0) },
          ]
        : [{ key: "yakandoz", amount: 500, quantity: Number(order.yakandozCount || 0) }];
    }

    for (const service of services) {
      if (service.quantity <= 0) continue;
      await addWorkerEarnings({
        dateId: getTodayString(),
        members,
        service,
        teamId: team.id,
        teamName: team.teamName,
        teamType: "packing",
      });
    }
  };


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
    !assetsLoaded || (currentWorker &&
    workers.length === 0)
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
  async function loadTodayStats() {

    const today = getTodayString()

    const archiveQuery = query(
      collection(db, "archives"),
      where("archiveDate", "==", today)
    );

    const archiveSnap = await getDocs(archiveQuery);

    let income = 0;
    let salary = 0;

    archiveSnap.forEach((doc) => {

      const order = doc.data();

      income += Number(order.price || 0);
      salary += Number(order.totalSalary || 0);

    });

    const expenseRef = doc(db, "expenses", today);

    const expenseSnap = await getDoc(expenseRef);

    let expenseFund = 0;
    if (expenseSnap.exists()) {

      const expense = expenseSnap.data();
      expenseFund = Number(expense.earnedToday || 0);

    }

    const profit = income - salary - expenseFund;

    setStats(prev => ({
      ...prev,
      income,
      salary,
      expenseFund,
      profit,
    }));

  }


  function formatMoney(value) {
    return Number(value || 0).toLocaleString("uz-UZ");
  }

  /* ===== chiqim fondiniki ===== */
  const expenseCategories = [
    "⛽️ Yoqilg'i",
    "🧴 Shampun",
    "🧸 Yumos",
    "⚡️ kommunal to'lov",
    "📦 Rulon paket",
    "📦 Adyol upakovka",
    "🖨 Reklama",
    "🍲 abet",
    "📝 Boshqa..."
  ];


  async function loadExpenseFund() {
    const today = getTodayString();

    const expenseRef = doc(db, "expenses", today);
    const expenseSnap = await getDoc(expenseRef);

    if (!expenseSnap.exists()) {
      setExpenseItems([]);

      setExpenseStats({
        openingFund: 0,
        earnedToday: 0,
        spentToday: 0,
        remainingFund: 0,
      });

      return;
    }

    const expense = expenseSnap.data();

    setExpenseStats({
      openingFund: Number(expense.openingFund || 0),
      earnedToday: Number(expense.earnedToday || 0),
      spentToday: Number(expense.spentToday || 0),
      remainingFund: Number(expense.remainingFund || 0),
    });
 
    const itemsQuery = query(
      collection(expenseRef, "items"),
      orderBy("createdAt", "desc")
    );

    const itemsSnap = await getDocs(itemsQuery);

    const list = itemsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setExpenseItems(list);
  }


  const saveExpense = async () => {
    if (!expenseForm.category) {
      alert("Kategoriyani tanlang");
      return;
    }

    if (!expenseForm.amount) {
      alert("Summani kiriting");
      return;
    }

    await addExpense({
      category: expenseForm.category,
      amount: expenseForm.amount,
      note: expenseForm.note
    });

    setExpenseForm({
      category: "",
      amount: "",
      note: ""
    });

    setShowExpenseModal(false);

    loadExpenseFund();
  };


  async function getWorkerEarnings(startDate) {

    const workersMap = {};
    let totalSalary = 0;

    // Hozircha faqat bitta kun
    const workerRef = doc(db, "workerEarnings", startDate);
    const workerSnap = await getDoc(workerRef);

    if (!workerSnap.exists()) {
      return {
        totalSalary: 0,
        workers: [],
      };
    }

    Object.entries(workerSnap.data()).forEach(([phone, worker]) => {

      const driverSalary = Number(worker.driverSalary || 0);
      const washerSalary = Number(worker.washerSalary || 0);
      const packingSalary = Number(worker.packingSalary || 0);

      const workerTotal = driverSalary + washerSalary + packingSalary;

      totalSalary += workerTotal;

      workersMap[phone] = {
        phone,
        name: worker.name,
        driverSalary,
        washerSalary,
        packingSalary,
        totalSalary: workerTotal,
      };

    });

    const workers = Object.values(workersMap);

    workers.sort(
      (a, b) => b.totalSalary - a.totalSalary
    );

    return {
      totalSalary,
      workers,
    };
  }


  async function loadTodayWorkers() {
    const today = getTodayString();

    const result = await getWorkerEarnings(today, today);

    setTodayWorkers(result.workers);
  }


  return (

  <div 
    style={{ 
      marginBottom: 80,
      padding: 1,
    }}
  >

      {/* ===== rolelar ===== */}
    {!role && page === "home" && (

      <HomePage
        currentWorker={currentWorker}
        setRole={changeRole}
        currentPhone={currentPhone}
        washerTeam={washerTeam}
        driverTeam={driverTeam}
        packingTeam={packingTeam}
        operatorTeam={operatorTeam}
      />
   
    )}


    {/* ===== statistika =====  */}
    {page === "stats" && (<div style={{padding: 15,}}>

      <div className="stats-tabs">

        <button
          className={statsTab === "stats"
            ? "stats-tab active"
            : "stats-tab"}
          onClick={() => setStatsTab("stats")}
        >
          📊 Statistika
        </button>

        <button
          className={statsTab === "expense"
            ? "stats-tab active"
            : "stats-tab"}
          onClick={() => setStatsTab("expense")}
        >
          💸 Chiqim fondi
        </button>

      </div>

      {statsTab === "stats" && (<>

        <div className="stats-cards">

          <InfoCard
            icon="💰"
            title="Jami tushum"
            value={formatMoney(stats.income)}
            suffix="so'm"
          />

          <InfoCard
            icon="👷"
            title="Jami ish haqi"
            value={formatMoney(stats.salary)}
            suffix="so'm"
          />

          <InfoCard
            icon="💸"
            title="Chiqim fondi"
            value={formatMoney(stats.expenseFund)}
            suffix="so'm"
          />

          <InfoCard
            icon="💵"
            title="Sof foyda"
            value={formatMoney(stats.profit)}
            suffix="so'm"
          />

        </div>

        <div className="today-workers-card">

          <h3>👷 Bugungi ishchilar</h3>

          {todayWorkers.length === 0 ? (

            <div className="empty-workers">
              Bugun hali ish haqi hisoblanmagan
            </div>

          ) : (

            todayWorkers.map(worker => (

              <div
                key={worker.phone}
                className="today-worker-item"
              >

                <span>
                  {worker.name}
                </span>

                <strong>
                  {formatMoney(worker.totalSalary)} so'm
                </strong>

              </div>

            ))

          )}

        </div>

      </>)}

      {statsTab === "expense" && (
        <div marginBottom>

          <div className="stats-cards">

            <InfoCard
              icon="🏦"
              title="Boshlang'ich"
              value={formatMoney(expenseStats.openingFund)}
              suffix="so'm"
            />

            <InfoCard
              icon="📈"
              title="Qo'shildi"
              value={formatMoney(expenseStats.earnedToday)}
              suffix="so'm"
            />

            <InfoCard
              icon="💸"
              title="Ishlatildi"
              value={formatMoney(expenseStats.spentToday)}
              suffix="so'm"
            />

            <InfoCard
              icon="💰"
              title="Mavjud"
              value={formatMoney(expenseStats.remainingFund)}
              suffix="so'm"
            />

          </div>

          <button
            className="add-expense-btn"
            onClick={() => setShowExpenseModal(true)}
          >
            ➕ Xarajat qo'shish
          </button>

          <div className="expense-history-card">

            <div className="expense-history-header">
              💸 Bugungi xarajatlar
            </div>

            {expenseItems.length === 0 ? (
              <div className="expense-empty">
                Bugun hali xarajat qo'shilmagan
              </div>
            ) : (
              expenseItems.map(item => (
                <div className="expense-item-card" key={item.id}>
   
                  <div className="expense-item-top">
                    <span className="expense-category">
                      {item.category}
                    </span>

                    <span className="expense-amount">
                      {formatMoney(item.amount)} so'm
                    </span>
                  </div>

                  {item.note && (
                    <div className="expense-note">
                      {item.note}
                    </div>   
                  )}
  
                  <div className="expense-footer">
                    <span>{item.worker}</span>
  
                    <span>
                      {item.createdAt?.toDate?.().toLocaleTimeString(
                        "uz-UZ",
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </span>
                  </div>

                </div>
              ))
            )}

          </div>

        </div>
      )}

    </div>)}


    {/* ===== profil ===== */}
    {page === "profile" && (
      <div>

        <InfoCard
          icon="💰"
          title="Mavjud"
          value={formatMoney(expenseStats.remainingFund)}
          suffix="so'm"
        />

        <button
          className="add-expense-btn"
          onClick={() => setShowExpenseModal(true)}
        >
          ➕ Xarajat qo'shish
        </button>

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

         <VaqtinchalikHisobot />
         <VaqtinchalikOylikChiqim/>

      </div>
    )}


    <div
      className={`role-transition ${roleTransition}`}
    >
    {/* ===== operator panel ===== */}
    {page === "home" && displayRole === "operator" && (

      <OperatorPanel

        orders={orders}
        setRole={changeRole}
        loading={loading}
        runAction={runAction}

      />
      
    )}


    {/* ===== driver panel ===== */}
    {page === "home" && displayRole === "driver" && (
      <DriverPanel

        orders={orders}
        driverMode={driverMode}
        setDriverMode={setDriverMode}
        saveDetails={saveDetails}
        setRole={changeRole}
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
        loading={loading}
        runAction={runAction}
        calculateTotalSalary={calculateTotalSalary}
        washerPrices={washerPrices}
        driverPrices={driverPrices}
        packingPrices={packingPrices}
        updateExpenseFund={updateExpenseFund}

      />
    )}


    {/* ===== washer panel ===== */}
    {page === "home" && displayRole === "washer" && (
      <WasherPanel

        orders={orders}
        updateWasherStatus={updateWasherStatus}
        setRole={changeRole}  
        washerTeam={washerTeam}
  
      />
    )}
    {/* ===== tayyorlovchi panel ===== */}
    {page === "home" && displayRole === "tayyorlovchi" && (
      <PackingPanel
        orders={orders}
        packingTeam={packingTeam}
        updatePackingStatus={updatePackingStatus}
        setRole={changeRole}
      />
    )}



    {/* ===== admin panel ===== */}
    {page === "home" && displayRole === "admin" && (
    
      <AdminPanel
        workerRequests={workerRequests}
        approveWorker={approveWorker}
      />
    )}

    {/* ===== ega panel ===== */}
    {page === "home" && displayRole === "ega"  && (
    
      <EgaPanel />

    )}

    </div>

    {/* ===== teams panel ===== */}
    {page === "teams" && (
      <TeamsPanel
        teams={teams}
        currentWorker={currentWorker}
        setPage={setPage}
        teamEarnings={teamEarnings}
        driverPrices={driverPrices}
        packingPrices={packingPrices}

      />
    )}


    {page === "archive" && (
      <ArchivePage/>
    )}


    <BottomNavigation
      page={page}
      setPage={setPage}
      currentWorker={currentWorker}
    />

    {showExpenseModal && (

      <div
        className="expense-modal-overlay"
        onClick={() => setShowExpenseModal(false)}
      >

        <div
          className="expense-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <h2>📋 Xarajat qo'shish</h2>
          <select
            value={expenseForm.category}
            onChange={(e)=>setExpenseForm({
              ...expenseForm,
              category:e.target.value
            })}
          >

            <option value="">Kategoriya tanlang</option>

            {expenseCategories.map(item=>(
              <option key={item}>
                {item}
              </option>
            ))}

          </select>

          {expenseForm.category==="📝 Boshqa..." && (
            <input
              placeholder="Kategoriya nomi"
              value={expenseForm.category}
              onChange={(e)=> setExpenseForm({
                ...expenseForm,
                category:e.target.value
              })}
            />
          )}

          <input
            type="number"
            placeholder="Summa"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({
              ...expenseForm,
              amount: e.target.value
            })}
          />

          <input
            placeholder="Izoh"
            value={expenseForm.note}
            onChange={(e) => setExpenseForm({
              ...expenseForm,
              note: e.target.value
            })}
          />

          <div className="expense-modal-buttons">
            <button 
              className="expense-cancel-btn"
              onClick={() => setShowExpenseModal(false)}
            >
              Bekor qilish
            </button>

            <button 
              className="expense-save-btn"
              onClick={saveExpense}
            >
              Saqlash
            </button>
          </div>

        </div>

      </div>

    )}
  </div>
  )
}

export default App
