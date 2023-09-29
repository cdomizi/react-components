export {};

declare global {
  interface CustomError {
    message?: string | undefined;
  }
}
