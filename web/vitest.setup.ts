// Eseguito da Vitest prima di ogni file di test. Imposta le variabili
// d'ambiente necessarie prima che qualunque modulo (in particolare
// src/lib/prisma.ts) venga importato, cosicché il client Prisma si connetta
// al database di test dedicato invece che a quello di sviluppo.
//
// Il database di test viene creato/aggiornato dallo script npm "test"
// (vedi package.json: "test:db:push" eseguito prima di "vitest run").
// Nota: per SQLite, Prisma risolve "file:..." come percorso relativo alla
// cartella di schema.prisma (prisma/), quindi "file:./test.db" produce
// prisma/test.db (non prisma/prisma/test.db).
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./test.db";
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ?? "test-session-secret-please-change-32-bytes-min";
