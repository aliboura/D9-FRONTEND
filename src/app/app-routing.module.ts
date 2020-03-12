import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: "referencial",
    loadChildren: () => import('./components/referencial/referencial.module').then(m => m.ReferencialModule)
  },
  {
    path: "sites-apps",
    loadChildren: () => import('./components/sites-apps/sites-apps.module').then(m => m.SitesAppsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
