import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: "categories",
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: "decisions",
    loadChildren: () => import('./decision/decision.module').then(m => m.DecisionModule)
  }
  ,
  {
    path: "status",
    loadChildren: () => import('./status/status.module').then(m => m.StatusModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferencialRoutingModule {
}
