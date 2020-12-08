import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {AuthGuardService} from "./security/auth-guard.service";
import {ExceptionsComponent} from "./exceptions/exceptions.component";
import {HelpsComponent} from "./helps/helps.component";


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "helps",
    component: HelpsComponent
  },
  {
    path: "apps-exceptions/:code",
    component: ExceptionsComponent
  },
  {
    path: "",
    canActivate: [AuthGuardService],
    loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule)
  },
  {path: "", redirectTo: "", pathMatch: "full"},
  {path: '**', redirectTo: 'apps-exceptions/4', pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
