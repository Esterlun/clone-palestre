// Usato sia per "non esiste" sia per "esiste ma non appartiene all'utente":
// non distinguiamo i due casi verso il chiamante per non rivelare
// l'esistenza di dati di altri utenti (regola "un utente vede solo i propri
// dati" di boundaries.md e requirements.md).
export class WorkoutNotFoundError extends Error {
  constructor(message = "Risorsa non trovata.") {
    super(message);
    this.name = "WorkoutNotFoundError";
  }
}

export class WorkoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkoutValidationError";
  }
}
