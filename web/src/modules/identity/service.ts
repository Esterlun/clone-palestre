import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";
import { EmailAlreadyUsedError, InvalidCredentialsError } from "./errors";
import type { AuthenticateUserInput, PublicUser, RegisterUserInput } from "./types";

function toPublicUser(user: { id: string; email: string; createdAt: Date }): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

/**
 * Crea un nuovo account. L'email è normalizzata (trim + lowercase) per
 * evitare account duplicati che differiscono solo per maiuscole/spazi.
 */
export async function registerUser(input: RegisterUserInput): Promise<PublicUser> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new EmailAlreadyUsedError(normalizedEmail);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash },
  });

  return toPublicUser(user);
}

/**
 * Verifica le credenziali fornite. Restituisce sempre lo stesso errore sia
 * per email inesistente sia per password errata, per non rivelare quali
 * email sono registrate.
 */
export async function authenticateUser(input: AuthenticateUserInput): Promise<PublicUser> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordIsValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordIsValid) {
    throw new InvalidCredentialsError();
  }

  return toPublicUser(user);
}

export async function getUserById(userId: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toPublicUser(user) : null;
}

/**
 * Verifica la password attuale prima di cambiarla: non ci si deve fidare di
 * un utente già autenticato per un'operazione così sensibile (coerente con
 * la richiesta di conferma prevista per l'eliminazione dell'account).
 */
export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const currentPasswordIsValid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!currentPasswordIsValid) {
    throw new InvalidCredentialsError();
  }

  const passwordHash = await hashPassword(input.newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

/**
 * Elimina l'account dopo aver verificato la password. Le relazioni
 * onDelete: Cascade in schema.prisma eliminano automaticamente modelli,
 * sessioni, esercizi personalizzati e metriche di proprietà dell'utente
 * (boundaries.md, "l'eliminazione dell'account deve coinvolgere le aree che
 * possiedono dati dell'utente").
 */
export async function deleteUserAccount(userId: string, currentPassword: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const currentPasswordIsValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!currentPasswordIsValid) {
    throw new InvalidCredentialsError();
  }

  await prisma.user.delete({ where: { id: userId } });
}
