import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuardService} from "../security/auth-guard.service";
import {JwtTokenService} from "../business/services/apps/jwt-token.service";

const routes: Routes = [
  {
    path: "home",
    canActivate: [AuthGuardService],
    loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
  },
  {
    path: "referencial",
    canActivate: [AuthGuardService],
    loadChildren: () => import('../components/referencial/referencial.module').then(m => m.ReferencialModule)
  },
  {
    path: "admin",
    canActivate: [AuthGuardService],
    loadChildren: () => import('../components/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: "sites-apps",
    canActivate: [AuthGuardService],
    loadChildren: () => import('../components/sites-apps/sites-apps.module').then(m => m.SitesAppsModule)
  },
  {
    path: "reporting",
    canActivate: [AuthGuardService],
    loadChildren: () => import('../components/reporting/reporting.module').then(m => m.ReportingModule)
  },
  {path: "", redirectTo: "home", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [JwtTokenService]
})
export class TemplateRoutingModule {
}
