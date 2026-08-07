# ADR 0001 — Stack tecnologico e struttura del progetto software

## Stato

Accettata.

## Contesto

`architecture.md` fissa i vincoli entro cui deve muoversi qualunque scelta
tecnologica per la Fase 1 (MVP):

- sviluppo da parte di una sola persona;
- MVP indicativamente entro un mese;
- budget minimo;
- priorità sull'affidabilità dei dati ("Affidabilità prima
  dell'elaborazione", `product.md`);
- accesso da più dispositivi;
- web app mobile-first;
- nessun funzionamento offline nell'MVP.

`architecture.md` fissa inoltre il pattern architetturale (monolite
modulare leggero, quattro aree: Identità e accesso, Gestione allenamenti,
Metriche personali, Storico e confronto) e le dipendenze consentite tra le
aree. Questo ADR registra come queste decisioni vengono tradotte in scelte
tecnologiche concrete; non le rimette in discussione.

Lo stack (Next.js + TypeScript, Prisma, SQLite in sviluppo) è stato deciso
dalla persona responsabile del progetto, non dall'AI. Questo documento ne
spiega la coerenza con i vincoli sopra elencati e registra le decisioni di
dettaglio prese durante l'implementazione dello scaffolding iniziale.

## Decisione

### Framework applicativo: Next.js (App Router) + TypeScript

Next.js copre in un unico framework sia le pagine sia la logica server
(Server Components, Server Actions), evitando di dover progettare, ospitare
e mantenere un backend API separato: coerente con "budget minimo" e "una
sola persona". Il rendering lato server e Server Actions permettono di
implementare i flussi di autenticazione e le future schermate senza un
layer HTTP/JSON aggiuntivo scritto a mano.

TypeScript in modalità `strict` è scelto per l'affidabilità dei dati: molti
errori di dominio (es. passare un id sbagliato tra moduli, dimenticare un
campo obbligatorio) diventano errori di compilazione invece che bug
scoperti in produzione.

Mobile-first è ottenuto con CSS responsive standard (nessun framework CSS
aggiuntivo per restare nel budget minimo); non introduce vincoli
particolari sullo stack.

### Persistenza: Prisma + SQLite (dev) → PostgreSQL (pronto al bisogno)

Prisma fornisce uno schema dichiarativo tipizzato: le relazioni tra entità
(es. `Session.sourceTemplateId → WorkoutTemplate`, con `onDelete: SetNull`)
sono esplicite nello schema e generano un client TypeScript verificato a
compile-time, riducendo il rischio di violare le regole di dominio per
errore.

SQLite è usato in sviluppo per restare a budget minimo (nessun server di
database da gestire). Tutte le query passano attraverso Prisma Client, senza
SQL raw specifico del dialetto: il passaggio a PostgreSQL richiede quindi di
cambiare solo `provider` e `url` nel blocco `datasource` di
`prisma/schema.prisma`. Un'eccezione dichiarata: Prisma non supporta il tipo
`enum` per il connettore SQLite, quindi campi che altrove sarebbero enum
(es. `Session.status`) sono modellati come `String` con i valori ammessi
documentati e validati a livello applicativo
(`src/modules/workouts/types.ts`). Passando a PostgreSQL si potrebbe, se
utile, convertirli in veri enum Prisma senza cambiare la logica applicativa.

### Autenticazione: sessione custom con cookie httpOnly, non NextAuth/Auth.js

È stata scelta una soluzione custom invece di NextAuth/Auth.js:

- **Hashing password**: `bcryptjs` (implementazione pura JavaScript, nessuna
  dipendenza nativa da compilare — rilevante su Windows dove i moduli nativi
  spesso richiedono toolchain C++ aggiuntive). Le password non sono mai
  salvate in chiaro.
- **Token di sessione**: JWT firmato con `jose`, salvato in un cookie
  httpOnly, `sameSite=lax`, `secure` in produzione. Essendo il cookie
  per-browser, l'accesso da più dispositivi funziona per costruzione: un
  login su un dispositivo non invalida la sessione su un altro, senza
  bisogno di una tabella di sessioni condivisa.
- **Motivo della scelta rispetto a NextAuth**: il requisito esplicito era
  "una funzione chiara per ottenere l'utente corrente autenticato, usata da
  tutti i moduli". Con una soluzione custom questa funzione
  (`src/lib/auth.ts#getCurrentUser`) è un wrapper minimo attorno a due
  funzioni pure e testabili del modulo identity
  (`createSessionToken`/`verifySessionToken`, in
  `src/modules/identity/session.ts`), verificabili con test unitari senza
  dover simulare l'intero ciclo di vita di NextAuth (provider, adapter,
  callback). Per un solo ruolo utente nell'MVP, la superficie di
  configurazione di NextAuth non aggiunge valore proporzionato alla
  complessità che introduce.

Le funzioni di servizio dei moduli (`workouts`, `metrics`, `history`) non
leggono mai il cookie direttamente: ricevono `userId` come primo parametro,
già risolto a monte da `getCurrentUser()` nella route/azione server
chiamante. Questo le mantiene pure e testabili con database reale, senza
dover simulare richieste HTTP nei test.

### Struttura a moduli

`src/modules/{identity,workouts,metrics,history}` rispecchia le quattro
aree di `architecture.md`/`boundaries.md`. Ogni modulo espone solo funzioni
di servizio pubbliche (`service.ts` / `templateService.ts` /
`sessionService.ts`); nessun altro modulo o route Next.js accede al client
Prisma per leggere o scrivere entità che appartengono a un altro modulo.

Il vincolo più rilevante è su `history`: `src/modules/history/service.ts`
non importa mai `@/lib/prisma`. Legge sessioni chiamando
`workouts/sessionService.ts` e metriche chiamando `metrics/service.ts`,
mai con query dirette sulle loro tabelle — cita esplicitamente questa regola
in un commento nel file, per renderla visibile a chi (persona o agente AI)
modificherà il codice in futuro.

L'indipendenza tra modello e sessione (regola di dominio ripetuta in
product.md, requirements.md, architecture.md, boundaries.md e
development-guidelines.md) è garantita anche a livello di schema, non solo
per convenzione applicativa: `SessionExercise` non ha alcuna chiave esterna
verso `TemplateExercise`. I dati vengono copiati al momento della creazione
della sessione; non esiste un percorso nello schema che permetta a una
modifica del modello di raggiungere una sessione già creata.

### Test: Vitest contro un database SQLite reale

Vitest è scelto per la compatibilità nativa con ESM/TypeScript senza
configurazione aggiuntiva e per la velocità di esecuzione. I test dei
service layer usano un database SQLite dedicato (`prisma/test.db`, creato
dallo script `npm run test` prima di eseguire Vitest) invece di mock del
client Prisma: le regole più critiche (indipendenza modello/sessione,
isolamento tra utenti, vincoli di unicità) dipendono dal comportamento
reale del database, non solo dalla logica applicativa, quindi un mock
darebbe una falsa sicurezza.

### Struttura del repository: progetto Next.js in `web/`, non nella root

La root del repository contiene la documentazione di prodotto
(`README.md` e gli altri file `.md`), che gli agenti AI devono leggere per
primi secondo il processo descritto nello stesso `README.md`. Creare il
progetto Next.js nella root avrebbe prodotto un secondo `README.md` in
conflitto con quello di documentazione e reso meno immediato distinguere
"documentazione di prodotto" da "codice e documentazione tecnica del
software". Il progetto software vive quindi in `web/`, con un proprio
`web/README.md` che spiega setup, avvio e test; il `README.md` di root resta
invariato ed è ancora il punto di ingresso per la documentazione di
prodotto.

### Deviazione dalla convenzione di naming di `development-guidelines.md`

`development-guidelines.md` (sezione 1) prescrive `snake_case` per variabili
e funzioni "seguendo il principio di PEP 8". PEP 8 è la guida di stile
ufficiale di Python: la regola presuppone implicitamente uno stack Python,
che non è il caso di questo progetto (Next.js/TypeScript/React).

Per questo progetto si usano le convenzioni idiomatiche dell'ecosistema
TypeScript/React, coerenti con lo stile ufficiale di Next.js e con le
regole di `eslint-config-next`:

- `camelCase` per variabili e funzioni;
- `PascalCase` per componenti React, classi e tipi/interfacce;
- `UPPER_CASE` per costanti.

Questa è una deviazione esplicita, richiesta dalla persona responsabile del
progetto per questa attività, non una decisione presa autonomamente
dall'agente. `development-guidelines.md` non è stato modificato in questa
attività (la sezione 9 del documento stesso richiede che gli aggiornamenti
siano revisionati manualmente); si segnala però che il documento potrebbe
beneficiare di un chiarimento esplicito — "PEP 8 per codice Python;
convenzioni idiomatiche del linguaggio per stack diversi" — per evitare che
lo stesso dubbio si ripresenti in attività future.

## Conseguenze

- Passare a PostgreSQL richiede di cambiare `datasource` in
  `prisma/schema.prisma` e la variabile d'ambiente `DATABASE_URL`; se in
  quel momento si volesse sfruttare il supporto nativo agli enum, andrebbe
  valutata una migrazione mirata di `Session.status`.
- Se in futuro servisse autenticazione OAuth (es. login con Google) o
  gestione più complessa delle sessioni (revoca lato server, sessioni
  multiple elencabili e revocabili singolarmente), la soluzione custom
  attuale andrà rivista: oggi un token JWT non può essere invalidato prima
  della sua scadenza naturale. Non è un problema per l'MVP (nessun
  requisito di logout forzato da remoto), ma è un limite noto.
- La regola "nessuna query diretta di `history` sulle tabelle di altri
  moduli" è oggi garantita solo da convenzione e commenti nel codice, non da
  un controllo automatico (es. lint rule dedicata). Un'eventuale violazione
  futura non verrebbe segnalata automaticamente.
