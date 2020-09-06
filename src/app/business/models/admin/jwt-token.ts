export class JwtToken {
  jwttoken: string;
  currentUser: string;

  constructor(jwttoken?: string, currentUser?: string) {
    this.jwttoken = jwttoken;
    this.currentUser = currentUser;
  }
}
