# Development Guidelines

## Scopo

Questo documento definisce le regole pratiche per sviluppare l’app in modo ordinato e affidabile.

Il progetto è sviluppato da una sola persona con il supporto di agenti AI. Il processo deve quindi restare leggero, senza introdurre procedure pensate per team grandi.

Principi principali:

- leggibilità prima della brevità;
- semplicità prima della flessibilità futura;
- modifiche piccole e verificabili;
- responsabilità chiare;
- revisione manuale di tutto il lavoro prodotto dall’AI.


## 1. Leggibilità e stile

Seguendo il principio di PEP 8, il codice deve essere chiaro, coerente ed esplicito.

Preferire:

- nomi descrittivi;
- funzioni con uno scopo preciso;
- pochi livelli di annidamento;
- condizioni facili da seguire;
- soluzioni coerenti con il codice esistente.

Evitare codice molto compatto, abbreviazioni poco chiare e astrazioni create solo per possibili esigenze future.

Convenzioni:

- variabili e funzioni in `snake_case`;
- classi in `PascalCase`;
- costanti in `UPPER_CASE`;
- righe normalmente non superiori a circa 88 caratteri;
- stesso termine per lo stesso concetto in tutto il progetto.

Esempi:

```text
current_user
workout_template
completed_session
body_measurement
exercise_result
```

Evitare nomi generici come `data`, `item`, `temp` o `value`, salvo contesti molto piccoli e chiari.

---

## 2. Organizzazione del progetto

Il progetto segue un monolite modulare leggero.

Le aree principali sono:

- identità e accesso;
- gestione allenamenti;
- metriche personali;
- storico e confronto.

Ogni funzionalità deve essere inserita nell’area che ne possiede responsabilità e dati.

Un’area può utilizzare informazioni di un’altra, ma non deve modificarne direttamente i dati.

Esempi:

- lo storico può leggere una sessione, ma non modificarla direttamente;
- le metriche personali non devono creare o eliminare allenamenti;
- modificare un modello non deve cambiare le sessioni passate.

Non creare un modulo separato per ogni piccola entità. La modularità deve semplificare il progetto, non frammentarlo.

---

## 3. Funzioni e commenti

Ogni funzione deve avere una responsabilità principale.

Una funzione va divisa quando:

- il nome non descrive tutto ciò che fa;
- contiene più operazioni indipendenti;
- è difficile da testare;
- richiede molti commenti;
- presenta troppo annidamento.

I commenti devono spiegare **perché** esiste una scelta, non ripetere ciò che il codice mostra già.

Commentare soprattutto:

- regole di dominio non evidenti;
- protezione dei dati storici;
- limiti conosciuti;
- decisioni collegate all’architettura.

---

## 4. Regole di dominio

Le regole principali devono essere controllate nella logica del sistema, non soltanto nell’interfaccia.

In particolare:

- un utente può accedere solo ai propri dati;
- una sessione può essere libera o partire da un modello;
- una sessione creata da un modello diventa indipendente;
- modificare o eliminare un modello non modifica le sessioni passate;
- le metriche personali non dipendono dalle sessioni;
- lo storico legge i dati, ma non modifica direttamente gli originali;
- un esercizio personalizzato appartiene all’utente che lo ha creato.

Le stesse regole non devono essere duplicate in più punti.

---

## 5. Errori, sicurezza e dati

Gli errori devono essere gestiti in modo esplicito.

Distinguere almeno tra:

- dati non validi;
- dato non trovato;
- operazione non autorizzata;
- stato non compatibile;
- errore interno.

I messaggi mostrati all’utente devono essere semplici. I dettagli tecnici devono restare nei log.

Un’operazione è conclusa solo quando il salvataggio è confermato. L’interfaccia non deve mostrare un successo prima che i dati siano stati salvati.

Ogni operazione deve verificare che il dato appartenga all’utente autenticato.

Non inserire nel repository:

- password;
- chiavi segrete;
- credenziali;
- dati personali reali.

---

## 6. Test

I test devono verificare comportamenti importanti, non dettagli interni irrilevanti.

Priorità:

- separazione dei dati tra utenti;
- salvataggio delle sessioni;
- indipendenza tra modelli e sessioni;
- modifiche ed eliminazioni;
- metriche personali;
- confronti nello storico.

Quando viene corretto un bug:

1. riprodurre il problema;
2. aggiungere un test che fallisce;
3. correggere il codice;
4. verificare tutti i test.

I nomi dei test devono descrivere il comportamento verificato.

```text
test_deleting_template_does_not_delete_past_sessions
```

---

## 7. Modifiche e Git

Ogni attività deve avere un obiettivo preciso.

Evitare di inserire nella stessa modifica:

- nuova funzionalità;
- grande refactoring;
- nuove dipendenze;
- correzioni non collegate.

I commit devono essere piccoli e descrittivi.

Esempi:

```text
Add free workout session flow
Fix template deletion affecting past sessions
Add body measurement validation
```

Prima di integrare una modifica:

- rileggere il codice;
- eseguire i test;
- controllare i file modificati;
- verificare che non siano presenti credenziali;
- aggiornare la documentazione necessaria.

---

## 8. Uso degli agenti AI

Prima di assegnare un’attività a un agente, indicare:

- obiettivo;
- requisito interessato;
- area coinvolta;
- comportamento atteso;
- cosa resta fuori perimetro;
- criteri di accettazione.

L’agente deve:

1. leggere i documenti rilevanti;
2. esaminare il codice esistente;
3. dichiarare dubbi o assunzioni;
4. proporre un piano breve;
5. mantenere la modifica limitata;
6. rispettare stile e confini dei moduli;
7. eseguire o proporre i test necessari.

L’agente non deve:

- aggiungere funzionalità non richieste;
- cambiare requisiti o architettura implicitamente;
- introdurre dipendenze senza motivazione;
- eliminare controlli solo per far passare i test.

Dopo il lavoro deve spiegare:

- cosa ha modificato;
- quali file sono coinvolti;
- quali test ha eseguito;
- quali rischi restano.

Tutto il lavoro prodotto dall’AI deve essere revisionato manualmente prima di essere accettato.

---

## 9. Documentazione

Aggiornare la documentazione solo quando cambia qualcosa di rilevante:

- `product.md` per problema, target o visione;
- `requirements.md` per i requisiti;
- `boundaries.md` per responsabilità e dipendenze;
- `roadmap.md` per fasi e priorità;
- ADR per decisioni architetturali importanti.

La documentazione deve descrivere il progetto reale, non funzionalità future presentate come già disponibili.

---

## 10. Checklist finale

Prima di concludere un’attività:

- [ ] Il requisito è chiaro.
- [ ] La modifica resta nel perimetro.
- [ ] Il codice appartiene all’area corretta.
- [ ] I nomi sono comprensibili.
- [ ] Gli errori sono gestiti.
- [ ] I dati degli utenti restano separati.
- [ ] I dati storici non vengono alterati.
- [ ] I test necessari sono stati eseguiti.
- [ ] Il lavoro dell’AI è stato revisionato.
- [ ] La documentazione interessata è aggiornata.


## Responsabilità del documento

Il documento viene mantenuto dalla persona che sviluppa il progetto.

L’AI può proporre modifiche o segnalare incoerenze, ma ogni aggiornamento deve essere revisionato manualmente.

Si aggiorna quando cambia il processo di sviluppo, emerge un errore ricorrente o viene adottata una nuova convenzione.

È condiviso tra la persona che sviluppa e gli agenti AI: deve esistere una sola versione ufficiale.
