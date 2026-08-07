export class EmailAlreadyUsedError extends Error {
  constructor(email: string) {
    super(`Esiste già un account con l'email ${email}.`);
    this.name = "EmailAlreadyUsedError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Email o password non corretti.");
    this.name = "InvalidCredentialsError";
  }
}
