import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{
  path: "sites",
  loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
}, {
  path: "audit",
  loadChildren: () => import('./audit-site/audit-site.module').then(m => m.AuditSiteModule)
}, {
  path: "typeAudit",
  loadChildren: () => import('./type-audit-site/type-audit-site.module').then(m => m.TypeAuditSiteModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesAppsRoutingModule {
}
