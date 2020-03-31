import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "referencial",
    loadChildren: () => import('./components/referencial/referencial.module').then(m => m.ReferencialModule)
  },
  {
    path: "sites-apps",
    loadChildren: () => import('./components/sites-apps/sites-apps.module').then(m => m.SitesAppsModule)
  },
  {path: "", redirectTo: "home", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
