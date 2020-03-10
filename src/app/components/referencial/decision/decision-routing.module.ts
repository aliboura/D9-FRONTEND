import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DecisionComponent} from "./decision.component";
import {DecisionListComponent} from "./decision-list/decision-list.component";
import {DecisionAddComponent} from "./decision-add/decision-add.component";
import {DecisionEditComponent} from "./decision-edit/decision-edit.component";

const routes: Routes = [
  {
    path: "",
    component: DecisionComponent,
    children: [
      {
        path: "",
        component: DecisionListComponent
      },
      {
        path: "add",
        component: DecisionAddComponent
      },
      {
        path: ":id",
        component: DecisionEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecisionRoutingModule {
}
