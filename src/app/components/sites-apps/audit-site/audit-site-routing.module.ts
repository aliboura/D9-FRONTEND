import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuditSiteListComponent} from "./audit-site-list/audit-site-list.component";
import {AuditSiteComponent} from "./audit-site.component";
import {AuditSiteAddComponent} from "./audit-site-add/audit-site-add.component";
import {AuditSiteEditComponent} from "./audit-site-edit/audit-site-edit.component";
import {AuditSiteSearchComponent} from "./audit-site-search/audit-site-search.component";
import {AuditSiteStepsComponent} from "./audit-site-steps/audit-site-steps.component";
import {AuditSiteFinishComponent} from "./audit-site-finish/audit-site-finish.component";
import {AuditSiteSecondVisitComponent} from "./audit-site-second-visit/audit-site-second-visit.component";
import {LoadGuardService} from "../../../security/load-guard.service";


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
        path: "add/:id",
        canLoad: [LoadGuardService],
        component: AuditSiteAddComponent
      },
      {
        path: "steps/:id",
        canLoad: [LoadGuardService],
        component: AuditSiteStepsComponent
      }, {
        path: "second/:id",
        canLoad: [LoadGuardService],
        component: AuditSiteSecondVisitComponent
      },
      {
        path: "finish/:id",
        canLoad: [LoadGuardService],
        component: AuditSiteFinishComponent
      },
      {
        path: "search",
        canLoad: [LoadGuardService],
        component: AuditSiteSearchComponent
      },
      {
        path: "edit/:id",
        canLoad: [LoadGuardService],
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
