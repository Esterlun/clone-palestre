# Definition of Done

## Scopo

Questo documento definisce quando un’attività può essere considerata conclusa.

Il progetto è sviluppato da una sola persona con il supporto di agenti AI. La Definition of Done deve quindi garantire qualità e affidabilità senza introdurre un processo troppo pesante.

## Criteri generali

Un’attività è conclusa quando:
- soddisfa il requisito approvato;
- resta nel perimetro definito;
- rispetta i confini (boundaries) del sistema;
- non modifica comportamenti non collegati;
- gestisce gli errori principali;
- protegge i dati degli utenti;
- include le verifiche necessarie;
- è stata revisionata manualmente;
- aggiorna la documentazione interessata.


## 1. Requisito completato

Il comportamento sviluppato deve corrispondere al requisito definito.

Devono essere verificati:

- flusso principale;
- casi alternativi rilevanti;
- dati non validi;
- operazioni non autorizzate;
- errori di salvataggio;
- conseguenze di modifica o eliminazione.

Non devono essere aggiunte funzionalità non richieste.

---

## 2. Coerenza con l’architettura

La modifica deve appartenere all’area corretta.

In particolare:

- lo storico non modifica direttamente sessioni o metriche;
- le metriche personali restano indipendenti dagli allenamenti;
- una sessione creata da un modello resta indipendente;
- modificare o eliminare un modello non altera le sessioni passate;
- ogni utente può accedere solo ai propri dati.

Se una modifica cambia responsabilità o dipendenze tra aree, deve essere aggiornata anche la documentazione architetturale.


## 3. Qualità del codice

Il codice deve essere:

- leggibile;
- coerente con lo stile esistente;
- diviso in funzioni con responsabilità chiare;
- privo di duplicazioni evitabili;
- senza complessità introdotta solo per esigenze future;
- privo di commenti inutili o codice non utilizzato.

Nomi, formattazione e struttura devono seguire le regole definite in `development-guidelines.md`.

---

## 4. Test e verifica

Devono essere eseguiti i test rilevanti per la modifica.

Una nuova funzionalità deve includere almeno verifiche per:

- comportamento previsto;
- input non valido;
- accesso ai dati del corretto utente;
- casi limite importanti.

La correzione di un bug deve includere un test che riproduca il problema e impedisca che venga introdotto nuovamente.

Tutti i test già esistenti devono continuare a passare.

Per le parti non coperte da test automatici deve essere eseguita una verifica manuale.

---

## 5. Affidabilità e sicurezza

Prima di concludere l’attività bisogna verificare che:

- i dati vengano salvati correttamente;
- un errore non venga mostrato come successo;
- le modifiche riguardino solo i dati richiesti;
- le eliminazioni non rimuovano dati non collegati;
- i dati storici non vengano alterati involontariamente;
- un utente non possa accedere ai dati di un altro;
- non siano presenti password, chiavi o dati personali nel repository.

---

## 6. Revisione del lavoro AI

Il lavoro prodotto da un agente AI deve essere revisionato manualmente.

La revisione deve controllare:

- correttezza rispetto al requisito;
- modifiche non richieste;
- assunzioni introdotte dall’agente;
- rispetto dei confini dei moduli;
- qualità dei test;
- nuove dipendenze;
- rimozione accidentale di controlli;
- codice inutilmente complesso.

Il fatto che i test passino non sostituisce la revisione manuale.

---

## 7. Documentazione

La documentazione deve essere aggiornata quando la modifica cambia:

- requisiti;
- comportamento visibile all’utente;
- responsabilità di un modulo;
- priorità o roadmap;
- decisioni architetturali;
- istruzioni operative.

Non è necessario aggiornare documenti generali per modifiche interne che non cambiano il comportamento del prodotto.

---

## 8. Versionamento

Prima di integrare la modifica:

- controllare tutti i file modificati;
- rimuovere file temporanei o non necessari;
- verificare che non siano presenti credenziali;
- eseguire i test;
- rileggere la modifica completa;
- usare un messaggio di commit chiaro.

Il commit deve contenere solo modifiche collegate alla stessa attività.

---

## Checklist finale

- [ ] Il requisito è soddisfatto.
- [ ] Non sono state aggiunte funzionalità fuori perimetro.
- [ ] La modifica appartiene all’area corretta.
- [ ] Le regole di dominio sono rispettate.
- [ ] Gli errori principali sono gestiti.
- [ ] I dati degli utenti restano separati.
- [ ] I dati storici non vengono alterati.
- [ ] I test necessari sono presenti e passano.
- [ ] La verifica manuale è stata completata.
- [ ] Il lavoro prodotto dall’AI è stato revisionato.
- [ ] Non sono presenti credenziali o dati sensibili.
- [ ] La documentazione necessaria è aggiornata.
- [ ] Il commit è chiaro e limitato all’attività.

Un’attività può essere considerata conclusa solo quando tutti i punti applicabili sono soddisfatti.

Se un punto non è applicabile, deve essere indicato esplicitamente invece di ignorarlo.


## Responsabilità del documento

Il documento viene mantenuto dalla persona che sviluppa il progetto.

L’AI può suggerire nuovi controlli o segnalare criteri mancanti, ma ogni modifica deve essere revisionata manualmente.

Si aggiorna quando cambia il livello di qualità richiesto, emerge un errore ricorrente o cambia il processo di sviluppo.

Il documento è condiviso tra la persona che sviluppa e gli agenti AI.
