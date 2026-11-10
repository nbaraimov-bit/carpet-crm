import {
  collection,
  documentId,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { getTashkentDateId } from "./statsUtils";

export async function ensureExpenseDocument(dateId = getTashkentDateId()) {
  const expenseRef = doc(db, "expenses", dateId);
  const expenseSnapshot = await getDoc(expenseRef);
  if (expenseSnapshot.exists()) return expenseRef;

  let openingFund = 0;
  const lastExpenseQuery = query(
    collection(db, "expenses"),
    orderBy(documentId(), "desc"),
    limit(1)
  );
  const lastExpenseSnapshot = await getDocs(lastExpenseQuery);
  if (!lastExpenseSnapshot.empty) {
    openingFund = Number(lastExpenseSnapshot.docs[0].data().remainingFund || 0);
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

export async function updateExpenseFund(order) {
  const earnedToday =
    Number(order.kvmSt || 0) * 3000 +
    Number(order.kvmPro || 0) * 3500 +
    Number(order.blanket1x || 0) * 15000 +
    Number(order.blanket2x || 0) * 15000 +
    Number(order.matras || 0) * 20000 +
    Number(order.yakandozM || 0) * 7500 +
    Number(order.yakandozS || 0) * 15000 +
    Number(order.yakandozL || 0) * 15000;

  const expenseRef = await ensureExpenseDocument();
  await updateDoc(expenseRef, {
    earnedToday: increment(earnedToday),
    currentFund: increment(earnedToday),
    remainingFund: increment(earnedToday),
  });
}
