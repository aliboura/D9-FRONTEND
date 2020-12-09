export class ApiResponse<T> {
  body: T;
  success: boolean;
  message: string;

  constructor(body?: T, success?: boolean, message?: string) {
    this.body = body;
    this.success = success;
    this.message = message;
  }
}
