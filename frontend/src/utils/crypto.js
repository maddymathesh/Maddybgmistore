/**
 * Cryptographic utility function to generate SHA-256 hash of a string.
 * Uses browser-native Web Crypto API (crypto.subtle), which is secure, fast,
 * and doesn't load large third-party cryptographic npm library dependencies.
 * 
 * @param {string} message - The plaintext string to hash.
 * @returns {Promise<string>} The hex-encoded SHA-256 hash.
 */
export async function sha256(message) {
  if (!message) return "";
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
