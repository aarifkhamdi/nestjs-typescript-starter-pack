export class KnownException extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}
