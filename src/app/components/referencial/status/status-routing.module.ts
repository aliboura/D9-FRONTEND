import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StatusComponent} from "./status.component";
import {StatusListComponent} from "./status-list/status-list.component";
import {StatusAddComponent} from "./status-add/status-add.component";
import {StatusEditComponent} from "./status-edit/status-edit.component";


const routes: Routes = [
  {
    path: "",
    component: StatusComponent,
    children: [
      {
        path: "",
        component: StatusListComponent
      },
      {
        path: "add",
        component: StatusAddComponent
      },
      {
        path: ":id",
        component: StatusEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule {
}
