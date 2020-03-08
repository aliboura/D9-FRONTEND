import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CategoriesListComponent} from "./categories-list/categories-list.component";
import {CategoriesAddComponent} from "./categories-add/categories-add.component";
import {CategoriesEditComponent} from "./categories-edit/categories-edit.component";
import {CategoriesComponent} from "./categories.component";


const routes: Routes = [
  {
    path: "",
    component: CategoriesComponent,
    children: [
      {
        path: "",
        component: CategoriesListComponent
      },
      {
        path: "add",
        component: CategoriesAddComponent
      },
      {
        path: ":id",
        component: CategoriesEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
}
