import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from "./users.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UsersEditComponent} from "./users-edit/users-edit.component";
import {UsersSiteComponent} from "./users-site/users-site.component";
import {UsersAddComponent} from "./users-add/users-add.component";


const routes: Routes = [
  {
    path: "",
    component: UsersComponent,
    children: [
      {
        path: "",
        component: UsersListComponent
      },
      {
        path: "add",
        component: UsersAddComponent
      },
      {
        path: ":id",
        component: UsersEditComponent
      },
      {
        path: "site/:username",
        component: UsersSiteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
