export class Categories {
  id: number;
  label: string;
  position: number;
  status: string;
  listSubCategories: Array<Categories> = [];
}
