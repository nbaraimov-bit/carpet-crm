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
import { useState, useEffect } from "react"
import { db } from "../../firebase";
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
  const [loginPhone, setLoginPhone] = useState("")
  const [currentWorker,setCurrentWorker] = useState(() => {
    try {
      const savedWorker = localStorage.getItem("worker");
      return savedWorker ? JSON.parse(savedWorker) : null;
    } catch {
      return null;
    }
  })
  const [washerPrices,setWasherPrices] = useState({})
  const [priceInputs,setPriceInputs] = useState({})
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
  const currentWorkerId = currentWorker?.firebaseId;
  const currentWorkerRole = currentWorker?.role;


  async function runAction(actionId, callback) {

    if (loading[actionId]) return;

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

        earned = Number(member[service.rateKey || service.key] || 0) * Number(service.quantity || 0);

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

      if (earned <= 0 || !member.phone) continue;

      const salaryField = teamType === "washer"
        ? "washerSalary"
        : teamType === "packing" ? "packingsalary" : "driverSalary";
      const oldWorker = earningsData[member.phone] || { name: member.name };

      earningsData[member.phone] = {
        ...oldWorker,
        name: member.name,
        [salaryField]: Number(oldWorker[salaryField] || 0) + earned,
      };

    }

    if (teamSalary <= 0) return;

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

    const oldTeam = teamData[teamId] || {};
    const nextTeam = {
      ...oldTeam,
      type: teamType,
      teamName,
      salary: Number(oldTeam.salary || 0) + teamSalary,
      totalSalary: Number(oldTeam.totalSalary ?? oldTeam.salary ?? 0) + teamSalary,
    };

    if (teamType === "washer" || teamType === "packing") {
      const productStatFields = [
        "carpetCount", "carpetSalary", "carpetKvm",
        "blanket1xCount", "blanket1xSalary", "blanket2xCount", "blanket2xSalary",
        "matrasCount", "matrasSalary", "blanketCount", "blanketSalary",
        "yakandozMCount", "yakandozMSalary", "yakandozSCount", "yakandozSSalary",
        "yakandozLCount", "yakandozLSalary", "yakandozCount", "yakandozSalary",
        "curtainMeter", "curtainSalary",
      ];
      for (const field of productStatFields) {
        if (Number(nextTeam[field]) === 0) delete nextTeam[field];
      }

      const earningKey = service.earningKey || (
        service.key === "blanket" ? "blanket1x"
          : service.key === "yakandoz" ? "yakandozM"
            : service.key
      );
      const productFields = {
        carpet: { count: "carpetCount", salary: "carpetSalary", oldCount: "carpetKvm", oldSalary: "carpetSalary" },
        blanket1x: { count: "blanket1xCount", salary: "blanket1xSalary", oldCount: "blanketCount", oldSalary: "blanketSalary" },
        blanket2x: { count: "blanket2xCount", salary: "blanket2xSalary", oldCount: "blanketCount", oldSalary: "blanketSalary" },
        matras: { count: "matrasCount", salary: "matrasSalary", oldCount: "blanketCount", oldSalary: "blanketSalary" },
        yakandozM: { count: "yakandozMCount", salary: "yakandozMSalary", oldCount: "yakandozCount", oldSalary: "yakandozSalary" },
        yakandozS: { count: "yakandozSCount", salary: "yakandozSSalary", oldCount: "yakandozCount", oldSalary: "yakandozSalary" },
        yakandozL: { count: "yakandozLCount", salary: "yakandozLSalary", oldCount: "yakandozCount", oldSalary: "yakandozSalary" },
        curtain: { count: "curtainMeter", salary: "curtainSalary", oldCount: "curtainMeter", oldSalary: "curtainSalary" },
      };
      const fields = productFields[earningKey];
      const quantity = Number(service.quantity || 0);

      if (fields && quantity > 0 && teamSalary > 0) {
        nextTeam[fields.count] = Number(oldTeam[fields.count] || 0) + quantity;
        nextTeam[fields.salary] = Number(oldTeam[fields.salary] || 0) + teamSalary;
        if (fields.oldCount !== fields.count) {
          nextTeam[fields.oldCount] = Number(oldTeam[fields.oldCount] || 0) + quantity;
        }
        if (fields.oldSalary !== fields.salary) {
          nextTeam[fields.oldSalary] = Number(oldTeam[fields.oldSalary] || 0) + teamSalary;
        }
      }
    } else if (teamType === "driver") {
      const legacyFields = {
        carpet: ["carpetKvm", "carpetSalary"],
        blanket: ["blanketCount", "blanketSalary"],
        yakandoz: ["yakandozCount", "yakandozSalary"],
        curtain: ["curtainMeter", "curtainSalary"],
      };
      const fields = legacyFields[service.key];
      const quantity = Number(service.quantity || 0);
      if (fields && quantity > 0 && teamSalary > 0) {
        const countField = stage ? `${stage}${fields[0][0].toUpperCase()}${fields[0].slice(1)}` : fields[0];
        const salaryField = stage ? `${stage}${fields[1][0].toUpperCase()}${fields[1].slice(1)}` : fields[1];
        nextTeam[countField] = Number(oldTeam[countField] || 0) + quantity;
        nextTeam[salaryField] = Number(oldTeam[salaryField] || 0) + teamSalary;
      }
      if (stage === "pickup") {
        nextTeam.totalPickupSalary = Number(oldTeam.totalPickupSalary || 0) + teamSalary;
        nextTeam.pickupSalary = Number(oldTeam.pickupSalary || 0) + teamSalary;
      }
      if (stage === "delivery") {
        nextTeam.totalDeliverySalary = Number(oldTeam.totalDeliverySalary || 0) + teamSalary;
        nextTeam.deliverySalary = Number(oldTeam.deliverySalary || 0) + teamSalary;
      }
    }

    teamData[teamId] = nextTeam;
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
        setPriceInputs(snap.data())
      }
    }

    getPrices()

  }, [])

  useEffect(() => {

    if (!currentWorkerId)
      return

    const unsubscribe = onSnapshot(

      doc(
        db,
        "workers",
        currentWorkerId
      ),

      (snapshot) => {

        const data = snapshot.data()

        if (!data) return
         
        if (
          currentWorkerRole !== "admin" &&
          currentWorkerRole !== "ega" &&
          data.role !== currentWorkerRole
        ) {

          localStorage.removeItem("worker")

          window.location.reload()

          return
        }

        setCurrentWorker((worker) => worker ? ({
          ...worker,
          ...data
        }) : worker)

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

  }, [currentWorkerId, currentWorkerRole])

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
  // Ushbu ma'lumot yuklagichlar render holatiga bog'liq emas; sahifa yoki bo'lim o'zgarganda qayta chaqiriladi.
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

      const dateId = getTodayString()

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

      const totalSalary = calculateTotalSalary(
        order,
        washerPrices,
        driverPrices,
        packingPrices
      );

      await setDoc(
        doc(
          db, "archives", order.id
        ),{
          ...order,
          status: "Yetkazildi",
          archivedAt: serverTimestamp(),
          archiveDate: dateId,
          totalSalary,
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

      if (packingTeam) {
        updates.packingTeamId = packingTeam.id;
        updates.packingTeamName = packingTeam.teamName;
      }

      const dateId = getTodayString();

      if (packingTeam) {

        const members = Object.values(packingTeam.members);

        const hasBlanketSizes = [order.blanket1x, order.blanket2x, order.matras]
          .some((value) => value !== undefined && value !== null && value !== "");
        const hasYakandozSizes = [order.yakandozM, order.yakandozS, order.yakandozL]
          .some((value) => value !== undefined && value !== null && value !== "");
        const packingServices = [
          { key: "carpet", earningKey: "carpet", amount: 300, quantity: Number(order.kvm || 0) },
          { key: "blanket", earningKey: "blanket1x", amount: 800, quantity: hasBlanketSizes ? Number(order.blanket1x || 0) : Number(order.blanketCount || 0) },
          { key: "blanket", earningKey: "blanket2x", amount: 1000, quantity: Number(order.blanket2x || 0) },
          { key: "blanket", earningKey: "matras", amount: 2000, quantity: Number(order.matras || 0) },
          { key: "yakandoz", earningKey: "yakandozM", amount: 500, quantity: hasYakandozSizes ? Number(order.yakandozM || 0) : Number(order.yakandozCount || 0) },
          { key: "yakandoz", earningKey: "yakandozS", amount: 1000, quantity: Number(order.yakandozS || 0) },
          { key: "yakandoz", earningKey: "yakandozL", amount: 1500, quantity: Number(order.yakandozL || 0) },
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

      const dateId = getTodayString();

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

  if (!assetsLoaded) {
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
      const packingSalary = Number(worker.packingsalary ?? worker.packingSalary ?? 0);

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

    const result = await getWorkerEarnings(today);

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
        washerTeam={washerTeam}
        driverTeam={driverTeam}
        packingTeam={packingTeam}
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
        updateStatus={updateStatus}
        setRole={changeRole}
        role={role}
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
        washerTeam={washerTeam}
        addWorkerEarnings={addWorkerEarnings}
        getTodayString={getTodayString}
        setRole={changeRole}
      />
    )}


    {/* ===== tayyorlovchi panel ===== */}
    {page === "home" && displayRole === "tayyorlovchi" && (
      <PackingPanel
        orders={orders}
        packingTeam={packingTeam}
        addWorkerEarnings={addWorkerEarnings}
        getTodayString={getTodayString}
        setRole={changeRole}
      />
    )}

    {/* ===== admin panel ===== */}
    {page === "home" && displayRole === "admin" && (
      <AdminPanel setRole={changeRole} />
    )}

    {/* ===== ega panel ===== */}
    {page === "home" && displayRole === "ega"  && (
    
      <EgaPanel
        setRole={changeRole}

        priceInputs={priceInputs}
        setPriceInputs={setPriceInputs}

        driverPrices={driverPrices}
        setDriverPrices={setDriverPrices}

        packingPrices={packingPrices}
        setPackingPrices={setPackingPrices}

      />  

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
