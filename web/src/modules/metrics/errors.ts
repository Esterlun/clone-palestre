export class MetricNotFoundError extends Error {
  constructor(message = "Misurazione non trovata.") {
    super(message);
    this.name = "MetricNotFoundError";
  }
}

export class MetricValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetricValidationError";
  }
}
