import { SignJWT, jwtVerify } from "jose";

// Nome del cookie httpOnly che contiene il token di sessione. Definito qui
// (proprietà del modulo identity) perché solo questo modulo decide come
// viene rappresentata una sessione autenticata.
export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 giorni

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET non configurato. Impostare la variabile d'ambiente prima di avviare l'app (vedi .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Crea un token di sessione (JWT firmato) per l'utente indicato. Il token
 * viene salvato in un cookie httpOnly dal chiamante (route/server action):
 * essendo un cookie per-browser, un login su un dispositivo non invalida la
 * sessione su un altro dispositivo, soddisfacendo il requisito di accesso
 * da più dispositivi senza bisogno di uno stato di sessione condiviso.
 */
export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

/**
 * Verifica un token di sessione e restituisce l'id utente contenuto, oppure
 * null se il token è assente, scaduto o manomesso. Funzione pura: non legge
 * cookie né altro stato Next.js, per restare facilmente testabile.
 */
export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
