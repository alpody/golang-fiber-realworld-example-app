export class ExhaustiveError extends Error {
  static {
    this.prototype.name = "ExhaustiveError";
  }

  constructor(value: never, message = `Unsupported type: ${value}`) {
    super(message);
  }
}
