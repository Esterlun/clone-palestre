## Scopo del documento

Questo documento definisce come il sistema è diviso internamente e chiarisce:

- quali responsabilità appartengono a ogni area;
- quali dati gestisce ogni area;
- quali dipendenze sono consentite;
- quali comportamenti devono essere evitati.

L’obiettivo è impedire che, con il tempo, tutte le funzionalità vengano mescolate tra loro.

Il progetto utilizza un **monolite modulare leggero**: l’applicazione viene sviluppata e distribuita come un unico sistema, ma il codice è organizzato in aree con responsabilità chiare.


## Principio generale

Ogni area deve occuparsi principalmente dei propri dati e delle proprie regole.

Un’area può chiedere informazioni a un’altra, ma non dovrebbe modificare direttamente dati che non le appartengono.

Per esempio:

- lo Storico può leggere le sessioni;
- lo Storico non può modificare una sessione;
- le Metriche personali possono esistere senza un allenamento;
- la modifica di un modello non deve cambiare le sessioni passate.

La divisione non deve essere troppo rigida. Modelli, sessioni ed esercizi restano nella stessa area perché fanno parte dello stesso flusso principale.

---

# 1. Gestione allenamenti

È l’area principale del sistema.

## Responsabilità

Gestisce:

- modelli di allenamento;
- sessioni svolte;
- sessioni libere;
- esercizi predefiniti;
- esercizi personalizzati;
- serie, ripetizioni e carichi;
- durata e distanza;
- modifica e completamento delle sessioni.

## Dati gestiti

Questa area è responsabile dei dati relativi a:

- modelli;
- esercizi presenti nei modelli;
- sessioni;
- esercizi realmente svolti;
- prestazioni registrate durante una sessione.

## Regole principali

### Modello e sessione sono diversi

Il modello descrive quello che l’utente pensa di svolgere.

La sessione descrive quello che l’utente ha realmente svolto.

Quando una sessione viene creata da un modello, copia le informazioni necessarie, ma poi diventa indipendente.

Quindi:

- modificare un modello non modifica le sessioni passate;
- eliminare un modello non elimina le sessioni già registrate;
- durante una sessione l’utente può cambiare esercizi, serie o carichi senza modificare automaticamente il modello.

### Le sessioni possono essere libere

Una sessione non deve necessariamente derivare da un modello.

L’utente può iniziare un allenamento libero e aggiungere gli esercizi durante l’utilizzo.

### Gli esercizi possono essere predefiniti o personali

L’app contiene un elenco iniziale di esercizi, ma l’utente può creare esercizi personalizzati.

Ogni esercizio indica quali informazioni possono essere registrate, per esempio:

- serie;
- ripetizioni;
- carico;
- durata;
- distanza.

## Non è responsabile di

Questa area non gestisce:

- peso corporeo e circonferenze;
- autenticazione;
- pagamenti;
- abbonamenti;
- prenotazioni di corsi;
- comunicazioni con trainer;
- suggerimenti automatici di allenamento.

---

# 2. Metriche personali

Questa area gestisce le misurazioni personali dell’utente.

È separata dalla Gestione allenamenti perché una metrica può essere registrata anche senza aver svolto una sessione.

## Responsabilità

Gestisce:

- peso corporeo;
- percentuale di massa grassa;
- circonferenza vita;
- circonferenza petto;
- circonferenza braccia;
- circonferenza cosce;
- data della misurazione;
- modifica o eliminazione di una misurazione.

Tutte le metriche sono facoltative.

## Dati gestiti

Questa area è responsabile delle singole misurazioni personali registrate dall’utente.

## Regole principali

- una misurazione appartiene a un solo utente;
- una misurazione non deve dipendere da una sessione;
- eliminare una sessione non deve eliminare le metriche personali;
- lo Storico può leggere le metriche, ma non modificarle direttamente.

## Non è responsabile di

Non gestisce:

- esercizi;
- modelli;
- sessioni;
- carichi o ripetizioni;
- suggerimenti medici;
- fotografie dei progressi.

---

# 3. Storico e confronto

Questa area permette di consultare e confrontare informazioni già presenti nel sistema.

Non rappresenta la fonte originale dei dati.

## Responsabilità

Permette di:

- visualizzare gli allenamenti passati;
- consultare il dettaglio di una sessione;
- confrontare le prestazioni dello stesso esercizio;
- mostrare l’ultima prestazione accanto a quella corrente;
- mostrare l’andamento delle metriche personali;
- filtrare i dati per periodo o esercizio.

## Dati utilizzati

Legge informazioni da:

- Gestione allenamenti;
- Metriche personali.

## Regola principale

Lo Storico **legge e organizza** i dati, ma non ne diventa proprietario.

Non deve creare una seconda copia completa di sessioni e metriche senza una necessità concreta.

Quando l’utente vuole correggere un dato visualizzato nello storico:

- la modifica viene richiesta all’area proprietaria;
- la sessione viene modificata dalla Gestione allenamenti;
- la misurazione viene modificata dalle Metriche personali.

## Non è responsabile di

Non deve:

- modificare direttamente le sessioni;
- modificare direttamente le metriche;
- creare modelli;
- decidere come l’utente deve allenarsi;
- generare suggerimenti automatici nell’MVP.

---

# 4. Identità e accesso

L’autenticazione è una responsabilità trasversale.

Non rappresenta una funzionalità principale del prodotto, ma protegge l’accesso a tutte le altre aree.

## Responsabilità

Gestisce:

- accesso dell’utente;
- uscita dall’account;
- identificazione dell’utente corrente;
- accesso da più dispositivi;
- separazione dei dati tra utenti;
- eliminazione dell’account.

## Regole principali

- un utente può vedere solo i propri dati;
- ogni operazione deve essere collegata all’utente autenticato;
- non ci si deve fidare solamente dell’identificativo ricevuto dall’interfaccia;
- l’eliminazione dell’account deve coinvolgere le aree che possiedono dati dell’utente.

L’autenticazione protegge le altre aree, ma non decide le loro regole interne.

Per esempio, verifica chi è l’utente, ma non decide come deve essere creata una sessione.

---

# 5. Dipendenze consentite

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
