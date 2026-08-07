// Rappresentazione pubblica di un utente: non contiene mai passwordHash.
// Tutti i moduli devono usare questo tipo (mai l'entità Prisma User grezza)
// quando restituiscono dati utente verso l'esterno.
export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface RegisterUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserInput {
  email: string;
  password: string;
}
