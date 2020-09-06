import {SubCategories} from "./sub-categories";

export class Categories {
  id: number;
  label: string;
  position: number;
  status: boolean;
  first: boolean;
  last: boolean;
  orderNum: number;
  typeAuditSiteId: number;
  typeAuditSiteLabel: string;
  nextCatId: number;
  nextCatLabel: string;
  nextCatOrder: number;
  previousCatId: number;
  previousCatLabel: string;
  previousCatOrder: number;
  listSubCategories: SubCategories[] = [];

  constructor(id?: number, label?: string) {
    this.id = id || null;
    this.label = label || "";
  }
}
