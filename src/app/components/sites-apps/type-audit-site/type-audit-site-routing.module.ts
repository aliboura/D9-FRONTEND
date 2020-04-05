import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TypeAuditSiteComponent} from "./type-audit-site.component";
import {TypeAuditSiteListComponent} from "./type-audit-site-list/type-audit-site-list.component";
import {TypeAuditSiteAddComponent} from "./type-audit-site-add/type-audit-site-add.component";
import {TypeAuditSiteEditComponent} from "./type-audit-site-edit/type-audit-site-edit.component";
import {CategoriesComponent} from "../../referencial/categories/categories.component";
import {CategoriesListComponent} from "../../referencial/categories/categories-list/categories-list.component";
import {CategoriesAddComponent} from "../../referencial/categories/categories-add/categories-add.component";
import {CategoriesEditComponent} from "../../referencial/categories/categories-edit/categories-edit.component";


const routes: Routes = [
  {
    path: "",
    component: TypeAuditSiteComponent,
    children: [
      {
        path: "",
        component: TypeAuditSiteListComponent
      },
      {
        path: "add",
        component: TypeAuditSiteAddComponent
      },
      {
        path: ":id",
        component: TypeAuditSiteEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeAuditSiteRoutingModule {
}
