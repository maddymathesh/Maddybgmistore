import * as jose from 'jose';

// Generates a JWT signed with a secret
export async function createPaymentJWT(payload, secretPin) {
    // Pad the PIN to ensure it meets minimum length for HS256 (32 bytes)
    const secretString = secretPin.padEnd(32, '0');
    const secretKey = new TextEncoder().encode(secretString);

    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt || '1h')
        .sign(secretKey);

    return jwt;
}

export async function verifyPaymentJWT(jwt, secretPin) {
    try {
        const secretString = secretPin.padEnd(32, '0');
        const secretKey = new TextEncoder().encode(secretString);

        const { payload } = await jose.jwtVerify(jwt, secretKey);
        return { valid: true, payload };
    } catch (err) {
        if (err.code === 'ERR_JWT_EXPIRED') {
            return { valid: false, error: 'expired' };
        }
        return { valid: false, error: 'invalid' };
    }
}

// Without verify (just to see if expired or get public claims)
export function decodeJWT(jwt) {
    try {
        return jose.decodeJwt(jwt);
    } catch (err) {
        return null;
    }
}
