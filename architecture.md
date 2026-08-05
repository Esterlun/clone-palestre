# Architecture

## Scopo

Questo documento descrive l’architettura concettuale dell’app e le decisioni che la motivano.

Definisce:

- il pattern architetturale scelto;
- come applicarlo concretamente al progetto;
- i confini tra le aree;
- la proprietà dei dati;
- le dipendenze consentite;
- i principali trade-off;
- i rischi;
- le condizioni che potrebbero richiedere una revisione futura.

Non contiene framework, database, servizi o altre scelte di stack tecnologico.

---

## 1. Contesto

L’app permette a persone che si allenano autonomamente di:

- creare modelli di allenamento;
- registrare sessioni reali;
- usare esercizi predefiniti o personalizzati;
- registrare metriche personali;
- consultare storico e progressi.

I principali vincoli sono:

- sviluppo da parte di una sola persona;
- MVP indicativamente entro un mese;
- budget minimo;
- priorità sull’affidabilità dei dati;
- accesso da più dispositivi;
- web app mobile-first;
- nessun funzionamento offline nell’MVP.

L’architettura deve quindi essere ordinata e mantenibile, ma non più complessa del necessario.

---

## 2. Pattern scelto

L’app utilizza un **monolite modulare con modularità leggera**.

Il sistema viene sviluppato e distribuito come un’unica applicazione, ma è diviso internamente in aree con responsabilità e dati chiaramente definiti.

La modularità è detta “leggera” perché non viene creato un modulo separato per ogni entità.

Modelli, sessioni ed esercizi, per esempio, restano nella stessa area perché fanno parte dello stesso flusso funzionale e collaborano frequentemente.

---

## 3. Alternative considerate

### Monolite semplice

Tutto il sistema viene sviluppato nella stessa applicazione senza confini interni espliciti.

**Vantaggi**

- avvio molto rapido;
- struttura iniziale facile da comprendere;
- poca disciplina architetturale necessaria.

**Svantaggi**

- le responsabilità possono mescolarsi rapidamente;
- una modifica può avere conseguenze in parti non collegate;
- diventa più difficile capire chi può modificare determinati dati;
- l’evoluzione futura richiede prima di districare le dipendenze.

**Motivo dell’esclusione**

È semplice all’inizio, ma rischia di diventare disordinato man mano che vengono aggiunte metriche, storico, trainer, prenotazioni e altre funzionalità.

---

### Monolite modulare

Il sistema resta un’unica applicazione, ma le responsabilità sono separate tramite moduli logici.

**Vantaggi**

- sviluppo e distribuzione semplici;
- dati facilmente coerenti;
- confini più chiari;
- test più mirati;
- possibilità di aggiungere nuove aree senza mescolare tutto;
- eventuale estrazione futura di un modulo facilitata.

**Svantaggi**

- richiede disciplina per mantenere i confini;
- alcune separazioni potrebbero rivelarsi premature;
- i moduli non possono essere distribuiti o scalati separatamente;
- un problema grave nel processo può coinvolgere l’intera applicazione.

**Motivo della scelta**

Offre una struttura sufficiente per far evolvere il progetto, mantenendo una complessità compatibile con una sola persona e con un MVP breve.


## 4. Decisione

La scelta è:

> Un’unica applicazione organizzata in pochi moduli con responsabilità, dati e dipendenze chiaramente definite.

Il monolite modulare non deve essere soltanto una divisione in cartelle.

Per applicarlo correttamente, ogni modulo deve avere:

- una responsabilità precisa;
- dati di cui è proprietario;
- operazioni pubbliche utilizzabili dalle altre aree;
- regole interne non modificabili direttamente dall’esterno;
- dipendenze esplicite;
- test sulle proprie regole principali.

---

## 5. Moduli principali

### 5.1 Identità e accesso

Responsabile di:

- autenticazione;
- identificazione dell’utente corrente;
- accesso da più dispositivi;
- separazione dei dati tra utenti;
- eliminazione dell’account.

Possiede:

- account;
- informazioni necessarie per identificare l’utente.

Espone alle altre aree:

- identità dell’utente corrente;
- verifica dell’accesso;
- operazioni relative all’account.

Non deve contenere regole relative ad allenamenti o metriche.

---

### 5.2 Gestione allenamenti

Responsabile di:

- modelli di allenamento;
- sessioni;
- sessioni libere;
- esercizi predefiniti;
- esercizi personalizzati;
- serie, ripetizioni, carichi, durata e distanza;
- modifica e completamento delle sessioni.

Possiede:

- modelli;
- esercizi presenti nei modelli;
- sessioni;
- esercizi svolti;
- risultati delle singole serie;
- esercizi personalizzati.

Espone operazioni come:

- creare un modello;
- modificare o eliminare un modello;
- avviare una sessione;
- registrare una prestazione;
- completare una sessione;
- modificare o eliminare una sessione;
- leggere i dati necessari allo storico.

Modelli e sessioni restano nello stesso modulo perché hanno un legame stretto e condividono molte regole.

---

### 5.3 Metriche personali

Responsabile di:

- peso corporeo;
- percentuale di massa grassa;
- circonferenze;
- data delle misurazioni;
- modifica ed eliminazione delle registrazioni.

Possiede:

- tutte le misurazioni personali.

Espone operazioni come:

- registrare una misurazione;
- modificarla;
- eliminarla;
- leggere l’andamento nel tempo.

È separato dagli allenamenti perché una misurazione può esistere senza alcuna sessione.

---

### 5.4 Storico e confronto

Responsabile di:

- consultazione delle sessioni passate;
- confronto tra prestazioni dello stesso esercizio;
- visualizzazione dell’andamento delle metriche;
- ordinamento e filtraggio dei dati.

Non possiede sessioni o metriche.

Legge dati da:

- Gestione allenamenti;
- Metriche personali.

Non può modificare direttamente i dati originali.

Se l’utente corregge una sessione dallo storico, la richiesta deve essere gestita dal modulo Gestione allenamenti.

Lo storico è quindi principalmente una capacità di lettura e presentazione.

---

## 6. Dipendenze consentite

Le dipendenze principali sono:

```text
Identità e accesso
        ↓
Gestione allenamenti
        ↓
Storico e confronto

Identità e accesso
        ↓
Metriche personali
        ↓
Storico e confronto
