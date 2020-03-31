import {SubCategories} from "./sub-categories";

export class Categories {
  id: number;
  label: string;
  position: number;
  status: boolean;
  first: boolean;
  last: boolean;
  nextCatId: number;
  nextCatLabel: string;
  previousCatId: number;
  previousCatLabel: string;
  listSubCategories: SubCategories[];

  constructor(id?: number, label?: string) {
    this.id = id || null;
    this.label = label || "";
  }
}
