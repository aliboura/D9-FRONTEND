export class JwtToken {
  token: string;
  success: boolean;
  message: string;

  constructor(token?: string, success?: boolean, message?: string) {
    this.token = token;
    this.success = success;
    this.message = message;
  }
}
