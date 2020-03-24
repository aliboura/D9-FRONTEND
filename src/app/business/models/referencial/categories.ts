export class Categories {
  id: number;
  label: string;
  position: number;
  status: string;
  first: boolean;
  last: boolean;
  nextCatId: number;
  previousCatId: number;
  nextCat: Categories;
  previousCat: Categories;
  listSubCategories: Array<Categories> = [];
}
