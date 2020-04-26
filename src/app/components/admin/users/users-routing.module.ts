import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from "./users.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UsersEditComponent} from "./users-edit/users-edit.component";
import {UsersProfilComponent} from "./users-profil/users-profil.component";


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
        path: ":id",
        component: UsersEditComponent
      },
      {
        path: "profile/:username",
        component: UsersProfilComponent
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
