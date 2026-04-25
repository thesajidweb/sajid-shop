export class AppError extends Error {
  code: number;
  isOperational: boolean;
  constructor(message: string, code: number = 500) {
    super(message);
    this.code = code;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
