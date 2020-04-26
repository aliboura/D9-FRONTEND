export class Group {
  level = 0;
  parent: Group;
  expanded = false;
  totalCounts = 0;

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
