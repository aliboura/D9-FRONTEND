import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DecisionComponent} from "../decision/decision.component";
import {DecisionListComponent} from "../decision/decision-list/decision-list.component";
import {DecisionAddComponent} from "../decision/decision-add/decision-add.component";
import {DecisionEditComponent} from "../decision/decision-edit/decision-edit.component";
import {DecisionTypeComponent} from "./decision-type.component";
import {DecisionTypeListComponent} from "./decision-type-list/decision-type-list.component";
import {DecisionTypeAddComponent} from "./decision-type-add/decision-type-add.component";
import {DecisionTypeEditComponent} from "./decision-type-edit/decision-type-edit.component";


const routes: Routes = [
  {
    path: "",
    component: DecisionTypeComponent,
    children: [
      {
        path: "",
        component: DecisionTypeListComponent
      },
      {
        path: "add",
        component: DecisionTypeAddComponent
      },
      {
        path: ":id",
        component: DecisionTypeEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecisionTypeRoutingModule {
}
