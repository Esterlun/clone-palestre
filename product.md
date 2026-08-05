## Scopo del documento

Questo documento descrive il prodotto a livello generale: quale problema risolve, per chi viene sviluppato, quale valore deve offrire e in quale direzione potrà evolvere.

Non contiene il dettaglio completo delle funzionalità, le decisioni architetturali o le scelte tecnologiche. Queste informazioni appartengono a documenti separati.

Il documento rappresenta una fonte di contesto condivisa per le persone e per gli agenti AI che lavorano sul progetto.

## Problema

Le persone che si allenano autonomamente hanno bisogno di ricordare cosa hanno svolto, quali carichi hanno utilizzato e come stanno cambiando le loro prestazioni nel tempo.

In assenza di uno strumento adatto, queste informazioni vengono spesso registrate attraverso:

- note sul telefono;
- schede cartacee;
- fogli di calcolo;
- memoria personale;
- applicazioni molto complesse o poco adattabili alle proprie abitudini.

Il problema non è quindi la mancanza assoluta di strumenti, ma la frammentazione delle informazioni e la difficoltà di utilizzarle in modo coerente.

Quando i dati non sono strutturati, diventa difficile rispondere a domande semplici ma importanti:

- Quale carico ho utilizzato l’ultima volta?
- Sto migliorando nello stesso esercizio?
- Ho realmente seguito la routine pianificata?
- Come sono cambiate le mie metriche personali?
- Quali modifiche ho apportato alla mia scheda nel tempo?

Il prodotto deve ridurre lo sforzo necessario per registrare queste informazioni e renderle facilmente consultabili durante e dopo l’allenamento.


## Utenti destinatari

Il prodotto è rivolto inizialmente a persone che:

- si allenano autonomamente in palestra;
- seguono una routine strutturata oppure alternano schede e sessioni libere;
- vogliono registrare esercizi, serie, ripetizioni, carichi, durata o distanza;
- vogliono consultare uno storico ordinato;
- non necessitano, nell’MVP, della supervisione diretta di un trainer.

L’utente non deve necessariamente essere esperto. Il prodotto deve risultare comprensibile anche a chi vuole iniziare a tracciare gli allenamenti senza conoscere terminologia tecnica o metodologie avanzate.

---

## Obiettivo principale

L’obiettivo principale è permettere all’utente di registrare rapidamente ciò che svolge e recuperare informazioni affidabili sui propri allenamenti precedenti.

Il valore prioritario non è generare motivazione attraverso premi, classifiche o suggerimenti automatici. Il valore principale è costruire uno storico personale corretto, leggibile e utile.

Il prodotto deve aiutare l’utente a:

- pianificare allenamenti riutilizzabili;
- registrare ciò che è stato realmente svolto;
- distinguere tra programma previsto e risultato effettivo;
- confrontare le prestazioni dello stesso esercizio;
- osservare l’andamento delle metriche personali;
- modificare la propria routine senza perdere lo storico precedente.

Una sessione registrata deve rappresentare ciò che è realmente accaduto. Per questo, una modifica successiva al modello di allenamento non deve alterare automaticamente le sessioni già completate.

## Proposta di valore )?)

Il prodotto non vuole sostituire un trainer e non vuole decidere autonomamente come una persona dovrebbe allenarsi.

La proposta di valore è:

> Permettere a chi si allena autonomamente di registrare gli allenamenti con poco sforzo e comprendere facilmente cosa ha fatto e come sta cambiando nel tempo.

Rispetto a note o strumenti generici, l’app offre dati organizzati intorno ai concetti reali dell’allenamento: modelli, sessioni, esercizi e metriche personali.

Rispetto ad applicazioni più complesse, l’MVP evita funzionalità non essenziali e si concentra sulla continuità della registrazione.


## Principi di prodotto

### Affidabilità prima dell’elaborazione

È più importante conservare correttamente ciò che l’utente ha registrato che produrre statistiche complesse o suggerimenti automatici.

### Flessibilità senza perdita di struttura

L’utente può partire da un modello, modificarlo durante una sessione oppure iniziare un allenamento libero. Questa libertà non deve rendere lo storico disordinato.

### Complessità proporzionata

Le funzionalità future non devono appesantire inutilmente il primo rilascio.


## Visione futura

Il prodotto nasce come applicazione personale per il tracking degli allenamenti, ma potrà evolvere gradualmente.

Possibili sviluppi futuri includono:

- applicazione mobile dedicata;
- funzionamento offline;
- notifiche e promemoria;
- esportazione dei dati;
- assegnazione di schede da parte di un trainer;
- comunicazione tra utente e trainer;
- prenotazione di corsi;
- gestione di abbonamenti e pagamenti;
- supporto per più lingue e unità di misura;
- integrazione con dispositivi esterni.

Queste possibilità rappresentano una direzione, non requisiti già approvati. Devono essere valutate separatamente prima di entrare nel perimetro del prodotto.

## Cosa non è il prodotto nell’MVP
La prima versione non è:

- un gestionale completo per palestre;
- una piattaforma sociale;
- un sostituto di un professionista;
- un sistema che genera automaticamente programmi di allenamento;
- uno strumento medico;
- una piattaforma per pagamenti o prenotazioni;
- un’applicazione progettata per coprire immediatamente ogni possibile tipo di allenamento.

Questa distinzione serve anche agli agenti AI, che non devono introdurre automaticamente funzionalità apparentemente utili ma non approvate.

## Responsabilità del documento
### Chi lo scrive

Il documento è mantenuto dalla persona responsabile del prodotto e dello sviluppo.

L’AI può essere utilizzata per:

- produrre una prima bozza;
- trasformare discussioni in contenuti strutturati;
- individuare ambiguità o contraddizioni;
- proporre formulazioni più chiare;
- verificare la coerenza con gli altri documenti.

Ogni modifica significativa deve essere revisionata e approvata manualmente. L’AI non può modificare autonomamente la visione o il target del prodotto.

### Quando si aggiorna

Il documento si aggiorna solo quando cambia un elemento sostanziale, per esempio:

- il problema principale;
- il target;
- l’obiettivo del prodotto;
- la proposta di valore;
- il contesto principale di utilizzo;
- la visione futura;
- un principio generale che influenza più funzionalità.

Non deve essere aggiornato per ogni nuova attività, correzione tecnica o requisito di dettaglio.

I requisiti specifici devono essere modificati nel documento dedicato ai requisiti. Le decisioni tecniche devono essere registrate nella documentazione architetturale.

### Lettori

Il documento è destinato sia alle persone sia agli agenti AI.

Non vengono mantenute due versioni separate, perché entrambi devono lavorare sulla stessa definizione del prodotto.
