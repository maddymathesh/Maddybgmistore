const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const db = getFirestore();
const PAYMENT_LINKS = "payment_links";
const PAYMENT_SETTINGS = "payment_settings";
const SETTINGS_DOC = "default";
const DEFAULT_LINK_TTL_MINUTES = 10;
const MIN_LINK_TTL_MINUTES = 5;
const MAX_LINK_TTL_MINUTES = 30;

function getJwtSecret() {
  const secret = process.env.PAYMENT_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new HttpsError("failed-precondition", "PAYMENT_JWT_SECRET must be at least 32 characters.");
  }
  return secret;
}

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
    throw new HttpsError("permission-denied", "You are not allowed to manage payment links.");
  }
}

function cleanText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 120);
}

function makeToken() {
  return crypto.randomBytes(18).toString("base64url");
}

function getPaymentUrl(origin, accessToken) {
  const safeOrigin = typeof origin === "string" && /^https?:\/\//.test(origin)
    ? origin.replace(/\/$/, "")
    : process.env.PAYMENT_BASE_URL || "";
  return `${safeOrigin}/pay/${accessToken}`;
}

function signAccessToken(token, expiresAtMs) {
  const ttlSeconds = Math.max(60, Math.floor((expiresAtMs - Date.now()) / 1000));
  return jwt.sign({ t: token }, getJwtSecret(), { expiresIn: ttlSeconds });
}

function resolveLinkToken(accessToken) {
  const raw = cleanText(accessToken);
  if (!raw) return null;
  if (raw.includes(".")) {
    try {
      const payload = jwt.verify(raw, getJwtSecret());
      return typeof payload.t === "string" ? payload.t : null;
    } catch {
      return null;
    }
  }
  if (/^[A-Za-z0-9_-]{16,80}$/.test(raw)) return raw;
  return null;
}

async function getPaymentSettings() {
  const snap = await db.collection(PAYMENT_SETTINGS).doc(SETTINGS_DOC).get();
  const data = snap.exists ? snap.data() : {};
  return {
    upiId: cleanText(data.upiId || process.env.DEFAULT_UPI_ID),
    payeeName: cleanText(data.payeeName || process.env.DEFAULT_PAYEE_NAME, "Payee"),
    defaultTimerMinutes: Number(data.defaultTimerMinutes) || DEFAULT_LINK_TTL_MINUTES,
  };
}

async function loadActiveLink(token) {
  const docRef = db.collection(PAYMENT_LINKS).doc(token);
  const snapshot = await docRef.get();
  if (!snapshot.exists) return { docRef, data: null };

  const data = snapshot.data();
  const expiresAtMs = data.expiresAt?.toMillis
    ? data.expiresAt.toMillis()
    : new Date(data.expiresAt).getTime();

  if (data.status === "active" && expiresAtMs && expiresAtMs <= Date.now()) {
    await docRef.update({ status: "expired" });
    data.status = "expired";
  }

  return { docRef, data, expiresAtMs };
}

function serializePublicLink(data) {
  return {
    token: data.token,
    orderId: data.orderId,
    amount: data.amount,
    customerName: data.customerName,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt,
    expiresInMinutes: data.expiresInMinutes || DEFAULT_LINK_TTL_MINUTES,
    status: data.status,
  };
}

exports.getPaymentSettings = onCall(async (request) => {
  requireAdmin(request);
  const settings = await getPaymentSettings();
  return { settings };
});

exports.updatePaymentSettings = onCall(async (request) => {
  requireAdmin(request);
  const upiId = cleanText(request.data?.upiId);
  const payeeName = cleanText(request.data?.payeeName);
  const defaultTimerMinutes = Number(request.data?.defaultTimerMinutes);

  if (!upiId || !/^[\w.\-]{2,}@[\w.\-]+$/.test(upiId)) {
    throw new HttpsError("invalid-argument", "A valid UPI ID is required.");
  }
  if (!payeeName) {
    throw new HttpsError("invalid-argument", "Payee name is required.");
  }
  if (!Number.isInteger(defaultTimerMinutes) || defaultTimerMinutes < MIN_LINK_TTL_MINUTES || defaultTimerMinutes > MAX_LINK_TTL_MINUTES) {
    throw new HttpsError("invalid-argument", `Default timer must be between ${MIN_LINK_TTL_MINUTES} and ${MAX_LINK_TTL_MINUTES} minutes.`);
  }

  await db.collection(PAYMENT_SETTINGS).doc(SETTINGS_DOC).set({
    upiId,
    payeeName,
    defaultTimerMinutes,
    updatedAt: Timestamp.now(),
    updatedBy: request.auth.uid,
  }, { merge: true });

  return { settings: { upiId, payeeName, defaultTimerMinutes } };
});

exports.createPaymentLink = onCall(async (request) => {
  requireAdmin(request);

  const settings = await getPaymentSettings();
  const customerName = cleanText(request.data?.customerName, "Customer");
  const orderId = cleanText(request.data?.orderId);
  const amount = Number(request.data?.amount);
  const expiresInMinutes = Number(request.data?.expiresInMinutes || settings.defaultTimerMinutes);
  const pin = cleanText(request.data?.pin);
  const upiId = cleanText(request.data?.upiId) || settings.upiId;
  const payeeName = cleanText(request.data?.payeeName) || settings.payeeName;

  if (!customerName) throw new HttpsError("invalid-argument", "Customer name is required.");
  if (!orderId) throw new HttpsError("invalid-argument", "Order ID is required.");
  if (!Number.isFinite(amount) || amount <= 0) throw new HttpsError("invalid-argument", "A valid amount is required.");
  if (!Number.isInteger(expiresInMinutes) || expiresInMinutes < MIN_LINK_TTL_MINUTES || expiresInMinutes > MAX_LINK_TTL_MINUTES) {
    throw new HttpsError("invalid-argument", `Timer must be between ${MIN_LINK_TTL_MINUTES} and ${MAX_LINK_TTL_MINUTES} minutes.`);
  }
  if (!/^\d{4,6}$/.test(pin)) throw new HttpsError("invalid-argument", "PIN must be 4 to 6 digits.");
  if (!upiId) throw new HttpsError("failed-precondition", "Configure UPI ID in payment settings first.");

  const token = makeToken();
  const createdAt = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(Date.now() + expiresInMinutes * 60 * 1000);
  const accessToken = signAccessToken(token, expiresAt.toMillis());

  await db.collection(PAYMENT_LINKS).doc(token).set({
    token,
    accessToken,
    orderId,
    amount,
    customerName,
    pin,
    upiId,
    payeeName,
    createdAt,
    expiresAt,
    expiresInMinutes,
    status: "active",
    createdBy: request.auth.uid,
  });

  const url = getPaymentUrl(request.data?.origin, accessToken);

  return {
    token,
    accessToken,
    url,
    paymentUrl: url,
    expiresAt: expiresAt.toDate().toISOString(),
  };
});

exports.verifyPaymentLink = onCall(async (request) => {
  const token = resolveLinkToken(request.data?.token);
  if (!token) return { valid: false, reason: "invalid" };

  const { data } = await loadActiveLink(token);
  if (!data) return { valid: false, reason: "invalid" };
  if (data.status === "revoked") return { valid: false, reason: "revoked" };
  if (data.status !== "active") return { valid: false, reason: "expired" };

  return { valid: true, link: serializePublicLink(data) };
});

exports.verifyPaymentPin = onCall(async (request) => {
  const token = resolveLinkToken(request.data?.token);
  const pin = cleanText(request.data?.pin);
  if (!token || !/^\d{4,6}$/.test(pin)) {
    throw new HttpsError("invalid-argument", "Valid token and PIN are required.");
  }

  const { data } = await loadActiveLink(token);
  if (!data || data.status === "revoked") {
    return { valid: false, reason: "invalid" };
  }
  if (data.status !== "active") {
    return { valid: false, reason: "expired" };
  }
  if (data.pin !== pin) {
    return { valid: false, reason: "pin" };
  }

  return {
    valid: true,
    upiId: data.upiId,
    payeeName: data.payeeName,
    amount: data.amount,
    orderId: data.orderId,
    customerName: data.customerName,
  };
});

exports.revokePaymentLink = onCall(async (request) => {
  requireAdmin(request);
  const token = cleanText(request.data?.token);
  if (!token) throw new HttpsError("invalid-argument", "Token is required.");

  const docRef = db.collection(PAYMENT_LINKS).doc(token);
  const snapshot = await docRef.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Payment link not found.");

  await docRef.update({ status: "revoked", revokedAt: Timestamp.now() });
  return { success: true };
});

exports.deletePaymentLink = onCall(async (request) => {
  requireAdmin(request);
  const token = cleanText(request.data?.token);
  if (!token) throw new HttpsError("invalid-argument", "Token is required.");

  const docRef = db.collection(PAYMENT_LINKS).doc(token);
  const snapshot = await docRef.get();
  if (!snapshot.exists) throw new HttpsError("not-found", "Payment link not found.");

  await docRef.delete();
  return { success: true };
});
