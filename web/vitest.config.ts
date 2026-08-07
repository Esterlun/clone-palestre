import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts"],
    testTimeout: 15000,
    // I test condividono un unico file SQLite (prisma/test.db) e ripuliscono
    // le tabelle tra un test e l'altro: eseguirli in parallelo su più
    // processi causerebbe conflitti di lock sul file. La suite resta comunque
    // rapida per le dimensioni attuali del progetto.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
