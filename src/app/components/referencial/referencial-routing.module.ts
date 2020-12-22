import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuardService} from "../../security/auth-guard.service";
import {LoadGuardService} from "../../security/load-guard.service";

const routes: Routes = [
  {
    path: "categories",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: "decisions",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./decision/decision.module').then(m => m.DecisionModule)
  },
  {
    path: "decisionTypes",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./decision-type/decision-type.module').then(m => m.DecisionTypeModule)
  },
  {
    path: "status",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./status/status.module').then(m => m.StatusModule)
  },
  {
    path: "sub-categories",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./sub-categories/sub-categories.module').then(m => m.SubCategoriesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferencialRoutingModule {
}
