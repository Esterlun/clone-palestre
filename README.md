# Documentation README

## Scopo

Questo documento aiuta chiunque lavori sul software, sia una persona sia un agente AI, a orientarsi rapidamente nella documentazione del progetto.

Indica:

- come è organizzata la documentazione;
- dove trovare le informazioni;
- quali documenti leggere prima di iniziare una modifica;
- quale documento aggiornare quando cambia una decisione;
- quale ordine di lettura seguire.

Questo file non descrive direttamente i requisiti, l’architettura o l’implementazione del sistema.

Fa da guida agli altri documenti e rappresenta il punto di partenza della documentazione.

---

## Punto di partenza per gli agenti AI

Prima di proporre o applicare una modifica, un agente AI deve:

1. leggere questo `README.md`;
2. identificare il tipo di attività richiesta;
3. leggere i documenti collegati;
4. controllare il perimetro dell’MVP;
5. verificare i confini architetturali;
6. controllare le regole di sviluppo e la Definition of Done;
7. dichiarare eventuali dubbi o contraddizioni prima di procedere.

Un agente non deve basarsi solo sulla richiesta ricevuta. Deve verificare che la modifica sia coerente con la documentazione ufficiale del progetto.

---

## Ordine di lettura iniziale

Una persona o un agente che entra per la prima volta nel progetto dovrebbe leggere:

1. `README.md`
2. `product/product.md`
3. `product/requirements.md`
4. `product/roadmap.md`
5. `architecture/architecture.md`
6. `architecture/boundaries.md`
7. `development/development-guidelines.md`
8. `development/definition-of-done.md`
9. `agent/agent-instructions.md`
10. `agent/current-context.md`

Dopo la prima lettura completa, non è necessario rileggere ogni documento per ogni attività.

Devono essere consultati solo i documenti collegati alla modifica da svolgere.

---

## Documenti da leggere in base all’attività

### Nuova funzionalità

Leggere:

- `product/product.md`
- `product/requirements.md`
- `product/roadmap.md`
- `architecture/architecture.md`
- `architecture/boundaries.md`
- `development/development-guidelines.md`
- `development/definition-of-done.md`

Serve a verificare che la funzionalità:

- risolva un bisogno approvato;
- appartenga alla fase corretta;
- venga inserita nell’area corretta;
- rispetti i criteri di qualità.

---

### Correzione di un errore

Leggere:

- `product/requirements.md`
- `architecture/boundaries.md`
- `development/development-guidelines.md`
- `development/definition-of-done.md`
- `agent/current-context.md`

Serve a capire:

- quale comportamento è corretto;
- quale area possiede il dato;
- come verificare la correzione;
- se esistono problemi già noti.

---

### Refactoring

Leggere:

- `architecture/architecture.md`
- `architecture/boundaries.md`
- `development/development-guidelines.md`
- `development/definition-of-done.md`

Un refactoring deve migliorare la struttura senza cambiare i requisiti o il comportamento visibile del prodotto.

---

### Decisione architetturale

Leggere:

- `product/requirements.md`
- `architecture/architecture.md`
- `architecture/boundaries.md`

Una nuova decisione importante deve essere registrata tramite un ADR.

---

### Aggiornamento della roadmap

Leggere:

- `product/product.md`
- `product/requirements.md`
- `product/roadmap.md`

La modifica deve essere approvata manualmente.








