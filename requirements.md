## Scopo 

Questo documento raccoglie i requisiti confermati per l’MVP.

Serve a chiarire:

- cosa deve fare il prodotto;
- quali regole deve rispettare;
- quali vincoli esistono;
- cosa non deve essere sviluppato in questa fase.

Non contiene scelte tecnologiche o dettagli di implementazione.


# 1. Utente

Nell’MVP esiste un solo ruolo:

- utente finale che si allena autonomamente.

L’utente deve poter accedere ai propri dati da smartphone e/ o computer.

Non sono previsti ruoli per trainer, staff o amministratori di palestra.


# 2. Account e accesso

Il sistema deve permettere all’utente di:

- creare un account;
- accedere al proprio account;
- uscire dall’account;
- utilizzare lo stesso account da più dispositivi;
- eliminare il proprio account.

Ogni utente deve poter vedere e modificare solo i propri dati.

---

# 3. Modelli di allenamento

L’utente deve poter:

- creare più modelli di allenamento;
- assegnare un nome a ogni modello;
- aggiungere esercizi;
- definire l’ordine degli esercizi;
- indicare serie previste;
- indicare ripetizioni previste;
- indicare un eventuale carico obiettivo;
- aggiungere note;
- modificare un modello;
- duplicare un modello;
- eliminare un modello.

Esempi di modelli:

- Push;
- Pull;
- Legs;
- Full body;
- Upper body.

La modifica o eliminazione di un modello non deve modificare le sessioni già registrate.

---

# 4. Sessioni di allenamento

L’utente deve poter iniziare una sessione:

- partendo da un modello;
- senza modello, come sessione libera.

Una sessione deve contenere ciò che l’utente ha realmente svolto.

Durante la sessione l’utente deve poter:

- aggiungere esercizi;
- rimuovere esercizi;
- sostituire esercizi;
- modificare l’ordine;
- registrare i risultati;
- aggiungere note;
- correggere dati già inseriti;
- completare la sessione.

Una sessione creata da un modello deve diventare indipendente dal modello originale.

Le modifiche alla sessione non devono cambiare automaticamente il modello.

---

# 5. Esercizi

Gli esercizi possono essere:

- predefiniti dall’app;
- creati dall’utente.

Per ogni esercizio devono essere definiti i dati che possono essere registrati.

I dati supportati sono:

- serie;
- ripetizioni;
- carico;
- durata;
- distanza.

Non tutti i dati sono obbligatori per ogni esercizio.

Esempi:

- panca piana: serie, ripetizioni e carico;
- plank: durata;
- corsa: durata e distanza.

Gli esercizi personalizzati devono appartenere solamente all’utente che li ha creati.

---

# 6. Registrazione delle prestazioni

Per ogni esercizio svolto, l’utente deve poter registrare la combinazione di dati prevista.

Per un esercizio a serie deve essere possibile registrare risultati diversi per ogni serie.

Esempio:

| Serie | Ripetizioni | Carico |
|---|---:|---:|
| 1 | 10 | 50 kg |
| 2 | 8 | 50 kg |
| 3 | 7 | 50 kg |

I dati devono poter essere modificati anche dopo il completamento della sessione.

---

# 7. Metriche personali

L’utente deve poter registrare:

- peso corporeo;
- percentuale di massa grassa;
- circonferenza vita;
- circonferenza petto;
- circonferenza braccia;
- circonferenza cosce.

Ogni registrazione deve avere una data.

Tutte le metriche sono facoltative.

L’utente deve poter:

- aggiungere una misurazione;
- modificare una misurazione;
- eliminare una misurazione;
- vedere l’andamento nel tempo.

Nell’MVP non è possibile creare tipi di misurazione personalizzati.

---

# 8. Storico

L’utente deve poter:

- vedere l’elenco delle sessioni passate;
- aprire il dettaglio di una sessione;
- filtrare lo storico;
- consultare gli esercizi svolti;
- vedere serie, ripetizioni, carichi, durata e distanza;
- modificare o eliminare una sessione.

Lo storico deve mostrare i dati realmente registrati nella sessione, non quelli attualmente presenti nel modello di origine.

---

# 9. Confronto dei progressi

L’utente deve poter confrontare le prestazioni dello stesso esercizio nel tempo.

Il confronto deve essere semplice e leggibile.

Esempio:

```text
Sessione precedente:
Panca piana — 3 serie da 8 ripetizioni con 60 kg

Sessione attuale:
Panca piana — 3 serie da 8 ripetizioni con 62 kg
