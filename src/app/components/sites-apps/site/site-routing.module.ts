import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DecisionComponent} from "../../referencial/decision/decision.component";
import {DecisionListComponent} from "../../referencial/decision/decision-list/decision-list.component";
import {DecisionAddComponent} from "../../referencial/decision/decision-add/decision-add.component";
import {DecisionEditComponent} from "../../referencial/decision/decision-edit/decision-edit.component";
import {SiteComponent} from "./site.component";
import {SiteListComponent} from "./site-list/site-list.component";
import {SiteViewComponent} from "./site-view/site-view.component";


const routes: Routes = [
  {
    path: "",
    component: SiteComponent,
    children: [
      {
        path: "",
        component: SiteListComponent
      },
      {
        path: ":id",
        component: SiteViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {
}
