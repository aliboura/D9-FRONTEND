import {Decision} from "./decision";

export class SubCategories {
  id: number;
  label: string;
  position: number;
  status: boolean;
  valueType: number;
  blocking: boolean;
  categoriesId: number;
  categoriesLabel: string;

  decisionsList: Decision[] = [];
}
