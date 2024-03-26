/**
 * Custom error class to handle errors with status code
 *
 * Example:
 * throw new CustomError('Resource not found', 404);
 **/
export class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
