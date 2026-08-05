## Scopo

Questo documento descrive l’ordine previsto di sviluppo del prodotto.

Serve a chiarire:

- cosa viene sviluppato per primo;
- quali funzionalità vengono rimandate;
- quali dipendenze esistono tra le fasi;
- quando una fase può essere considerata conclusa.

La roadmap indica una direzione, non un calendario rigido. Le priorità possono cambiare in base ai risultati dell’MVP e al feedback degli utenti.

---

# Principi della roadmap

## Prima il problema principale

La prima versione deve risolvere bene un solo problema: registrare e consultare gli allenamenti personali.

Non verranno aggiunte funzionalità per palestre, trainer o pagamenti finché il tracking di base non sarà affidabile e semplice da usare.

## Ogni fase deve produrre valore autonomo

Una fase deve poter essere utilizzata anche senza completare immediatamente quella successiva.

Per esempio, il tracking degli allenamenti deve funzionare anche senza prenotazioni, notifiche o abbonamenti.

## Le funzionalità future non devono complicare l’MVP

L’architettura deve permettere evoluzioni future, ma non deve implementarle in anticipo.

Prepararsi al futuro significa mantenere confini chiari, non costruire funzionalità che oggi non servono.

## Il feedback può modificare l’ordine

Le fasi successive non sono definitive. Dopo l’MVP potrebbe emergere che gli utenti considerano più importante, per esempio, il funzionamento offline rispetto alla prenotazione dei corsi.

---

# Fase 0 — Definizione e progettazione

## Obiettivo

Definire il prodotto prima di iniziare l’implementazione.

## Attività

- chiarire il problema e il target;
- definire i requisiti dell’MVP;
- stabilire cosa resta fuori perimetro;
- descrivere il modello concettuale;
- scegliere il pattern architetturale;
- definire i confini tra i moduli;
- analizzare i principali flussi utente;
- registrare le decisioni architetturali;
- preparare le regole di lavoro per persone e agenti AI.

## Risultato atteso

Il progetto dispone di una documentazione approvata e sufficiente per iniziare lo sviluppo senza lasciare decisioni fondamentali implicite.

## Stato

In corso.

---

# Fase 1 — MVP: tracking degli allenamenti

## Obiettivo

Permettere a una persona che si allena autonomamente di registrare gli allenamenti e consultare i propri progressi.

La prima versione sarà una web app mobile-first.

## Funzionalità

### Account

- creazione dell’account;
- accesso e uscita;
- utilizzo da più dispositivi;
- separazione dei dati tra utenti;
- eliminazione dell’account.

### Modelli di allenamento

- creazione di più modelli;
- aggiunta e ordinamento degli esercizi;
- serie e ripetizioni previste;
- eventuale carico obiettivo;
- modifica, duplicazione ed eliminazione.

### Sessioni

- avvio da un modello;
- avvio di una sessione libera;
- aggiunta, modifica e rimozione degli esercizi;
- registrazione di serie, ripetizioni, carico, durata e distanza;
- completamento della sessione;
- modifica o eliminazione di una sessione passata.

### Esercizi

- catalogo iniziale di esercizi;
- creazione di esercizi personalizzati;
- definizione dei dati registrabili per ogni esercizio.

### Metriche personali

- peso corporeo;
- percentuale di massa grassa;
- circonferenze di vita, petto, braccia e cosce;
- modifica ed eliminazione delle misurazioni;
- visualizzazione dell’andamento nel tempo.

### Storico e confronto

- elenco delle sessioni passate;
- dettaglio di ogni sessione;
- confronto tra prestazioni dello stesso esercizio;
- visualizzazione dell’ultima prestazione;
- andamento delle metriche personali.

## Criteri per considerare concluso l’MVP

L’utente deve riuscire a:

1. accedere da smartphone e computer;
2. creare un modello;
3. registrare una sessione da un modello;
4. registrare una sessione libera;
5. recuperare e modificare i dati inseriti;
6. registrare metriche personali;
7. consultare lo storico;
8. confrontare le prestazioni;
9. accedere esclusivamente ai propri dati.

I dati devono restare disponibili e una modifica al modello non deve alterare le sessioni passate.

## Validazione

L’MVP verrà inizialmente provato da un gruppo ristretto di utenti.

Verranno osservati soprattutto:

- facilità di registrazione durante l’allenamento;
- continuità di utilizzo;
- errori o dati persi;
- tempo necessario per registrare una sessione;
- utilità dello storico;
- funzionalità percepite come mancanti.

Indicativamente, un primo segnale positivo è che un utente registri almeno due o tre allenamenti a settimana e continui a usare l’app per almeno un mese.

---

# Fase 1.1 — Consolidamento dell’MVP

## Obiettivo

Correggere i problemi emersi durante la validazione prima di ampliare il prodotto.

## Possibili interventi

- semplificazione dei flussi più lenti;
- miglioramento della visualizzazione su smartphone;
- correzione di problemi di affidabilità;
- miglioramento dello storico;
- gestione più chiara delle sessioni incomplete;
- miglioramento del catalogo degli esercizi;
- introduzione dell’esportazione dei dati, se richiesta dagli utenti.

Questa fase non deve trasformarsi automaticamente nell’aggiunta di nuove aree funzionali.

---

# Fase 2 — Prenotazione di corsi e lezioni

## Obiettivo

Permettere agli utenti di consultare e prenotare le attività offerte da una palestra.

## Funzionalità previste

- calendario dei corsi;
- disponibilità dei posti;
- prenotazione;
- cancellazione;
- lista d’attesa;
- storico delle prenotazioni.

## Dipendenze

Questa fase richiede nuove decisioni non presenti nell’MVP:

- introduzione del ruolo staff o amministratore;
- gestione delle palestre;
- creazione e aggiornamento dei corsi;
- regole su cancellazioni e liste d’attesa;
- possibile supporto a più palestre.

Prima dello sviluppo sarà necessario aggiornare requisiti, confini dei moduli e modello di dominio.

---

# Fase 3 — Comunicazioni e notifiche

## Obiettivo

Aiutare l’utente a ricordare attività importanti e ricevere comunicazioni rilevanti.

## Funzionalità possibili

- promemoria per i corsi prenotati;
- notifiche in caso di modifica o cancellazione;
- comunicazioni della palestra;
- promemoria relativi all’allenamento.

## Dipendenze

Le notifiche relative ai corsi dipendono dalla Fase 2.

Non verrà introdotta una chat completa senza un’esigenza confermata, perché richiederebbe gestione delle conversazioni, moderazione e nuove regole di accesso.

---

# Fase 4 — Abbonamenti e pagamenti

## Obiettivo

Permettere all’utente di consultare e, se necessario, gestire il proprio rapporto economico con la palestra.

## Funzionalità possibili

- stato dell’abbonamento;
- data di scadenza;
- storico dei pagamenti;
- rinnovo;
- pagamento tramite l’app.

## Perché viene dopo

Questa area introduce maggiore complessità:

- dati economici;
- gestione degli errori di pagamento;
- sicurezza;
- rimborsi;
- conformità normativa;
- integrazioni esterne;
- responsabilità della palestra.

Deve essere sviluppata solo dopo aver definito chiaramente il modello commerciale del prodotto.

---

# Evoluzioni da valutare separatamente

Le seguenti funzionalità non hanno ancora una fase approvata:

- applicazione mobile dedicata;
- utilizzo offline e sincronizzazione;
- assegnazione di schede da parte di trainer;
- comunicazione tra trainer e utente;
- esportazione e importazione dei dati;
- supporto per altre lingue;
- supporto per libbre e pollici;
- integrazione con dispositivi wearable;
- suggerimenti automatici;
- generazione automatica di programmi;
- foto dei progressi;
- funzionalità social.

Queste idee non devono essere considerate requisiti finché non vengono analizzate e approvate.

---

# Condizioni per passare a una nuova fase

Una nuova fase può iniziare quando:

- la fase precedente soddisfa i criteri di accettazione;
- i problemi principali emersi sono stati risolti;
- esiste un bisogno confermato;
- i nuovi requisiti sono stati documentati;
- sono state analizzate le dipendenze con le funzionalità esistenti;
- le eventuali decisioni architetturali sono state registrate;
- il perimetro è stato approvato manualmente.

La presenza di tempo disponibile non è sufficiente, da sola, per aggiungere una funzionalità.

---

# Ruolo dell’AI

L’AI può aiutare a:

- analizzare il feedback;
- individuare dipendenze tra le fasi;
- segnalare funzionalità premature;
- proporre criteri di accettazione;
- verificare la coerenza con requisiti e architettura;
- preparare aggiornamenti del documento.

L’AI non può autonomamente:

- spostare una funzionalità nell’MVP;
- dichiarare conclusa una fase;
- cambiare le priorità;
- aggiungere nuovi ruoli o aree del prodotto;
- trasformare una possibilità futura in un requisito approvato.

Ogni cambiamento della roadmap deve essere revisionato manualmente.

# Aggiornamento del documento
## Chi lo scrive

La roadmap viene mantenuta da chi gestisce lo sviluppo e le priorità del prodotto.

L’AI può preparare proposte e aggiornamenti, ma le decisioni finali restano umane.

## Quando si aggiorna

Il documento si aggiorna quando:

- una fase viene completata;
- cambia l’ordine delle priorità;
- una funzionalità entra o esce da una fase;
- il feedback modifica la direzione del prodotto;
- emerge una nuova dipendenza significativa;
- una possibilità futura viene approvata.

Non si aggiorna per ogni attività tecnica o correzione interna.

## Lettori

La roadmap è condivisa tra persone e agenti AI.

Deve esistere una sola versione ufficiale, perché tutti devono conoscere le stesse priorità e gli stessi limiti del lavoro corrente.
