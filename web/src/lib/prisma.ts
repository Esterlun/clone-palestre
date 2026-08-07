import { PrismaClient } from "@prisma/client";

// Singleton del client Prisma. In sviluppo, Next.js ricarica i moduli a ogni
// modifica (hot reload): senza questo accorgimento verrebbe creata una nuova
// connessione al database a ogni ricarica, fino a esaurire le connessioni
// disponibili. Pattern raccomandato dalla documentazione di Prisma per Next.js.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
