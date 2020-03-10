import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../business/services/referencial/categories.service";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {

  constructor(public categoriesService: CategoriesService) {
  }

  title = "Liste des Catégories";
  object = "categories";

  columns: string[] = ["label"];

  ngOnInit() {
  }

}
