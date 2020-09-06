import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from "../../security/auth-guard.service";
import {ReportingComponent} from "./reporting.component";
import {CategoriesListComponent} from "../referencial/categories/categories-list/categories-list.component";
import {ReportingViewComponent} from "./reporting-view/reporting-view.component";


const routes: Routes = [
  {
    path: "",
    component: ReportingComponent,
    children: [
      {
        path: "",
        component: ReportingViewComponent
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule {
}
