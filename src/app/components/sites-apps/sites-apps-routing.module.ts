import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuardService} from "../../security/auth-guard.service";
import {LoadGuardService} from "../../security/load-guard.service";

const routes: Routes = [
  {
    path: "sites",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
  }, {
    path: "audit",
    canActivate: [AuthGuardService],
    canLoad: [LoadGuardService],
    loadChildren: () => import('./audit-site/audit-site.module').then(m => m.AuditSiteModule)
  }, {
    path: "typeAudit",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./type-audit-site/type-audit-site.module').then(m => m.TypeAuditSiteModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesAppsRoutingModule {
}
