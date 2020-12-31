import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WilayaGroupComponent} from "./wilaya-group.component";
import {WilayaGroupListComponent} from "./wilaya-group-list/wilaya-group-list.component";
import {WilayaGroupEditComponent} from "./wilaya-group-edit/wilaya-group-edit.component";


const routes: Routes = [
  {
    path: "",
    component: WilayaGroupComponent,
    children: [
      {
        path: "",
        component: WilayaGroupListComponent
      }, {
        path: ":id",
        component: WilayaGroupEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WilayaGroupRoutingModule {
}
