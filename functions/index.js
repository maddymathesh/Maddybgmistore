const crypto = require("crypto");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const db = getFirestore();
const PAYMENT_LINKS = "payment_links";
const DEFAULT_LINK_TTL_MINUTES = 10;
const MIN_LINK_TTL_MINUTES = 1;
const MAX_LINK_TTL_MINUTES = 30;

function getAdminUids() {
  const values = [
    process.env.ADMIN_UID_1,
    process.env.ADMIN_UID_2,
    ...(process.env.ADMIN_UIDS || "").split(","),
  ];

  return values.map((uid) => uid && uid.trim()).filter(Boolean);
}

function requireAdmin(request) {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Admin sign-in is required.");
  }

  const adminUids = getAdminUids();
  if (adminUids.length === 0) {
    throw new HttpsError("failed-precondition", "Admin UID environment variables are not configured.");
  }

  if (!adminUids.includes(request.auth.uid)) {
    throw new HttpsError("permission-denied", "You are not allowed to create payment links.");
  }
}

function cleanText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 120);
}

function makeToken() {
  return crypto.randomBytes(18).toString("base64url");
}

function getPaymentUrl(origin, token) {
  const safeOrigin = typeof origin === "string" && /^https?:\/\//.test(origin)
    ? origin.replace(/\/$/, "")
    : process.env.PAYMENT_BASE_URL || "";

  return `${safeOrigin}/pay/${token}`;
}

exports.createPaymentLink = onCall(async (request) => {
  requireAdmin(request);

  const customerName = cleanText(request.data?.customerName, "Customer");
  const orderId = cleanText(request.data?.orderId);
  const amount = Number(request.data?.amount);
  const expiresInMinutes = Number(request.data?.expiresInMinutes || DEFAULT_LINK_TTL_MINUTES);
  const pin = cleanText(request.data?.pin);

  if (!customerName) {
    throw new HttpsError("invalid-argument", "Customer name is required.");
  }

  if (!orderId) {
    throw new HttpsError("invalid-argument", "Order ID is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpsError("invalid-argument", "A valid amount is required.");
  }

  if (!Number.isInteger(expiresInMinutes) || expiresInMinutes < MIN_LINK_TTL_MINUTES || expiresInMinutes > MAX_LINK_TTL_MINUTES) {
    throw new HttpsError("invalid-argument", "Timer must be between 1 and 30 minutes.");
  }

  if (!/^\d{4,6}$/.test(pin)) {
    throw new HttpsError("invalid-argument", "PIN must be 4 to 6 digits.");
  }

  const token = makeToken();
  const createdAt = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(Date.now() + expiresInMinutes * 60 * 1000);

  await db.collection(PAYMENT_LINKS).doc(token).set({
    token,
    orderId,
    amount,
    customerName,
    pin,
    createdAt,
    expiresAt,
    expiresInMinutes,
    status: "active",
    createdBy: request.auth.uid,
  });

  const url = getPaymentUrl(request.data?.origin, token);

  return {
    token,
    url,
    paymentUrl: url,
    expiresAt: expiresAt.toDate().toISOString(),
  };
});

exports.verifyPaymentLink = onCall(async (request) => {
  const token = cleanText(request.data?.token);

  if (!/^[A-Za-z0-9_-]{16,80}$/.test(token)) {
    return { valid: false, reason: "invalid" };
  }

  const docRef = db.collection(PAYMENT_LINKS).doc(token);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return { valid: false, reason: "invalid" };
  }

  const data = snapshot.data();
  const expiresAt = data.expiresAt;
  const expiresAtMs = expiresAt?.toMillis ? expiresAt.toMillis() : new Date(expiresAt).getTime();

  if (data.status !== "active" || !expiresAtMs || expiresAtMs <= Date.now()) {
    if (data.status === "active") {
      await docRef.update({ status: "expired" });
    }
    return { valid: false, reason: "expired" };
  }

  return {
    valid: true,
    link: {
      token: data.token,
      orderId: data.orderId,
      amount: data.amount,
      customerName: data.customerName,
      pin: data.pin,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt,
      expiresInMinutes: data.expiresInMinutes || DEFAULT_LINK_TTL_MINUTES,
      status: data.status,
    },
  };
});
