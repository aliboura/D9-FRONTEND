import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SubCategoriesListComponent} from "./sub-categories-list/sub-categories-list.component";
import {SubCategoriesAddComponent} from "./sub-categories-add/sub-categories-add.component";
import {SubCategoriesEditComponent} from "./sub-categories-edit/sub-categories-edit.component";
import {SubCategoriesComponent} from "./sub-categories.component";

const routes: Routes = [
  {
    path: "",
    component: SubCategoriesComponent,
    children: [
      {
        path: "",
        component: SubCategoriesListComponent
      },
      {
        path: "add",
        component: SubCategoriesAddComponent
      },
      {
        path: ":id",
        component: SubCategoriesEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoriesRoutingModule {
}
