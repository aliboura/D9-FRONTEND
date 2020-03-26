import {SubCategories} from "./sub-categories";

export class Categories {
  id: number;
  label: string;
  position: number;
  status: string;
  first: boolean;
  last: boolean;
  nextCatId: number;
  nextCatLabel: string;
  previousCatId: number;
  previousCatLabel: string;
  listSubCategories: SubCategories[] = [];
}
