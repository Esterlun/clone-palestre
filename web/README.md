# Clone Palestre — Web App

Applicazione web mobile-first per il tracking degli allenamenti personali
(Fase 1 / MVP). Questo file documenta come avviare e testare il **software**.

La documentazione di **prodotto** (problema, requisiti, roadmap,
architettura, confini, convenzioni di sviluppo, definition of done) si trova
nella root del repository, un livello sopra questa cartella, e resta la
fonte di verità per ogni decisione: `../README.md`, `../product.md`,
`../requirements.md`, `../roadmap.md`, `../architecture.md`,
`../boundaries.md`, `../development-guidelines.md`, `../definition-of-done.md`.

Le decisioni tecniche relative a questo progetto software sono registrate in
`../docs/adr/`.

## Stack

- Next.js (App Router) + TypeScript
- Prisma ORM
- SQLite in sviluppo locale (schema pensato per passare a PostgreSQL
  cambiando solo il `datasource` in `prisma/schema.prisma`)
- Vitest per i test dei service layer

## Requisiti

- Node.js 20 o superiore
- npm

## Setup

```bash
cp .env.example .env
# genera un valore casuale per SESSION_SECRET, ad esempio:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# e incollalo in .env al posto del segnaposto

npm install
npm run db:push
npm run db:seed   # opzionale: inserisce alcuni esercizi predefiniti
npm run dev
```

L'app sarà disponibile su http://localhost:3000.

## Test

```bash
npm run test
```

Lo script crea/aggiorna un database SQLite dedicato ai test
(`prisma/test.db`, ignorato da git) e poi esegue Vitest. I test dei service
layer usano il database reale (non mock), per verificare davvero i vincoli
di integrità e le regole di dominio (es. indipendenza tra modello e
sessione, isolamento tra utenti).

## Build

```bash
npm run build
```

## Struttura del progetto

```
src/app/            Route Next.js (App Router): pagine e server actions.
src/modules/         Logica di dominio divisa per area, rispecchia boundaries.md:
  identity/          Autenticazione, utenti, sessioni.
  workouts/           Modelli di allenamento, sessioni, esercizi.
  metrics/            Metriche personali (peso, circonferenze, ...).
  history/            Sola lettura: legge workouts/metrics, non possiede dati.
src/lib/             Infrastruttura condivisa (client Prisma, funzione
                     getCurrentUser() usata da tutte le route/azioni).
src/test/           Utilità condivise dai test (creazione dati, reset DB).
prisma/schema.prisma Schema dati.
prisma/seed.ts       Catalogo iniziale di esercizi predefiniti.
```

Ogni modulo espone solo funzioni di servizio pubbliche (i file
`service.ts` / `templateService.ts` / `sessionService.ts`). Nessun modulo
interroga direttamente le tabelle di un altro modulo: in particolare,
`src/modules/history/service.ts` non importa mai il client Prisma e legge
sessioni e metriche esclusivamente chiamando le funzioni pubbliche di
`workouts` e `metrics`.
