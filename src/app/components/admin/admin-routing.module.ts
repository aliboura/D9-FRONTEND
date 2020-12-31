import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from "../../security/auth-guard.service";
import {LoadGuardService} from "../../security/load-guard.service";


const routes: Routes = [
  {
    path: "users",
    canActivate: [AuthGuardService],
    canLoad: [LoadGuardService],
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: "affectations",
    canActivate: [AuthGuardService],
    canLoad: [LoadGuardService],
    loadChildren: () => import('./affectation/affectation.module').then(m => m.AffectationModule)
  },
  {
    path: "groups",
    loadChildren: () => import('./wilaya-group/wilaya-group.module').then(m => m.WilayaGroupModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
