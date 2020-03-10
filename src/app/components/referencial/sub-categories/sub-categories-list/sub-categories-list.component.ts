import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";

@Component({
  selector: 'app-sub-categories-list',
  templateUrl: './sub-categories-list.component.html'
})
export class SubCategoriesListComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService) {
  }

  title = "Liste des sous catégories";
  object = "sub-categories";

  columns: string[] = ["label", "position", "categoriesLabel", "status"];

  ngOnInit() {
  }

}
