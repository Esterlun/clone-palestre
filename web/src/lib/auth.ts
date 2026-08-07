import { cookies } from "next/headers";
import { getUserById } from "@/modules/identity/service";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/modules/identity/session";
import type { PublicUser } from "@/modules/identity/types";

/**
 * Funzione condivisa per ottenere l'utente autenticato corrente a partire
 * dal cookie di sessione. Deve essere usata da ogni route, server action o
 * pagina server che ha bisogno di sapere "chi sta chiamando" prima di
 * invocare i servizi dei moduli (identity, workouts, metrics, history).
 *
 * Non si fida di alcun identificativo ricevuto dal client se non tramite il
 * cookie httpOnly firmato: coerente con la regola di boundaries.md "non ci
 * si deve fidare solamente dell'identificativo ricevuto dall'interfaccia".
 */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const userId = await verifySessionToken(token);
  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function requireCurrentUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utente non autenticato.");
  }
  return user;
}
