import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuditSiteListComponent} from "./audit-site-list/audit-site-list.component";
import {AuditSiteComponent} from "./audit-site.component";
import {AuditSiteAddComponent} from "./audit-site-add/audit-site-add.component";
import {AuditSiteEditComponent} from "./audit-site-edit/audit-site-edit.component";


const routes: Routes = [
  {
    path: "",
    component: AuditSiteComponent,
    children: [
      {
        path: "",
        component: AuditSiteListComponent
      },
      {
        path: "add",
        component: AuditSiteAddComponent
      },
      {
        path: ":id",
        component: AuditSiteEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditSiteRoutingModule {
}
