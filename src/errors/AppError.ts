class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly status: boolean;

  public readonly reason: string;

  public readonly timestamp: number;

  constructor(message: string, reason: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.reason = reason;
    this.status = false;
    this.timestamp = Date.now();
  }
}

export default AppError;
