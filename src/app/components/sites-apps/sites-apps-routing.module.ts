import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{
  path: "sites",
  loadChildren: () => import('./site/site.module').then(m => m.SiteModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesAppsRoutingModule {
}
