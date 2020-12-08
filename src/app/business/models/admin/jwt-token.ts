export class JwtToken {
  body: string;
  success: boolean;
  message: string;

  constructor(body?: string, success?: boolean, message?: string) {
    this.body = body;
    this.success = success;
    this.message = message;
  }
}
