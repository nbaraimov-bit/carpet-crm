// TemporaryArchiveStats.js
// Sakura CRM — vaqtinchalik arxiv statistikasi
//
// archives collectionidan oxirgi 30 kunlik buyurtmalarni olib,
// jami summa, gilam m², adyol, yakandoz va sof foydani hisoblaydi.
//
// MUHIM:
// carpetCount = gilam SONI.
// Gilamning kv.m maydoni Firestore'da "kvm" fieldida saqlanadi.

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  db,
} from "firebase/firestore";

const CARPET_COST_PER_M2 = 6000;
const BLANKET_COST = 23500;
const YAKANDOZ_COST = 22500;

// Sonli qiymatlarni xavfsiz raqamga aylantirish
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const number = Number(
    String(value)
      .replace(/\s/g, "")
      .replace(",", ".")
  );

  return Number.isFinite(number) ? number : 0;
};

// archiveDate qiymatini Date formatiga o'tkazish
const getArchiveDate = (value) => {
  if (!value) return null;

  // Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  // Timestampga o'xshash obyekt
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  // Oddiy Date
  if (value instanceof Date) {
    return value;
  }

  // String yoki boshqa qiymat
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * archives collectionidan oxirgi 30 kunlik statistikani oladi.
 *
 * db — loyihadagi Firestore db obyektini uzating.
 */
export async function getTemporaryArchiveStats(db) {
  const to = new Date();

  const from = new Date(to);
  from.setDate(from.getDate() - 30);

  const q = query(
    collection(db, "archives"),
    where(
      "archiveDate",
      ">=",
      Timestamp.fromDate(from)
    )
  );

  const snapshot = await getDocs(q);

  let jamiSumma = 0;
  let jamiGilam = 0;
  let jamiAdyol = 0;
  let jamiYakandoz = 0;

  const orders = [];

  snapshot.forEach((doc) => {
    const order = {
      id: doc.id,
      ...doc.data(),
    };

    const archiveDate = getArchiveDate(
      order.archiveDate
    );

    // Noto'g'ri sana bo'lsa o'tkazib yuboramiz
    if (!archiveDate) return;

    // Kelajakdagi sanalarni hisoblamaymiz
    if (archiveDate > to) return;

    // 30 kundan eski bo'lsa hisoblamaymiz
    if (archiveDate < from) return;

    // Jami buyurtma summasi
    jamiSumma += toNumber(order.price);

    // MUHIM:
    // carpetCount — gilam SONI.
    // Gilamning maydoni — kvm fieldidan olinadi.
    jamiGilam += toNumber(order.kvm);

    // Adyol soni
    jamiAdyol += toNumber(order.blanketCount);

    // Yakandoz soni
    jamiYakandoz += toNumber(order.yakandozCount);

    orders.push(order);
  });

  // Sof foyda
  const sofFoyda =
    jamiSumma -
    (jamiGilam * CARPET_COST_PER_M2) -
    (jamiAdyol * BLANKET_COST) -
    (jamiYakandoz * YAKANDOZ_COST);

  return {
    from,
    to,

    orderCount: orders.length,

    jamiSumma,
    jamiGilam,
    jamiAdyol,
    jamiYakandoz,

    sofFoyda,

    orders,
  };
};


// Pulni chiroyli formatda chiqarish
export const formatSum = (value) => {
  return `${Math.round(
    toNumber(value)
  ).toLocaleString("uz-UZ")} so'm`;
};


// Gilam m² ni formatlash
export const formatM2 = (value) => {
  return `${Number(
    toNumber(value).toFixed(2)
  ).toLocaleString("uz-UZ")} m²`;
};


// Statistik kartalar uchun tayyor ma'lumot
export const buildTemporaryArchiveCards = (stats) => {
  return [
    {
      key: "jamiSumma",
      title: "Jami summa",
      value: formatSum(stats.jamiSumma),
    },

    {
      key: "jamiGilam",
      title: "Jami gilam",
      value: formatM2(stats.jamiGilam),
    },

    {
      key: "jamiAdyol",
      title: "Jami adyol",
      value: `${stats.jamiAdyol} ta`,
    },

    {
      key: "jamiYakandoz",
      title: "Jami yakandoz",
      value: `${stats.jamiYakandoz} ta`,
    },

    {
      key: "sofFoyda",
      title: "Sof foyda",
      value: formatSum(stats.sofFoyda),
    },
  ];
};