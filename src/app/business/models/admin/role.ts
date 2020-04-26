export class Role {
  authority: string;

  get label(): string {
    return this.authority;
  }
}
