import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UsersListComponent} from './users-list/users-list.component';
import {UsersEditComponent} from "./users-edit/users-edit.component";
import {TemplatesModule} from "../../../templates/templates.module";
import {MaterialModule} from "../../../importes/material/material.module";
import {SharedModule} from "../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {ClarityModule} from "@clr/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsersSiteComponent} from './users-site/users-site.component';
import {UsersAddComponent} from './users-add/users-add.component';


@NgModule({
  declarations: [UsersComponent, UsersListComponent, UsersEditComponent, UsersSiteComponent, UsersAddComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TemplatesModule,
    MaterialModule,
    SharedModule,
    TranslateModule,
    ClarityModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UsersModule {
}
