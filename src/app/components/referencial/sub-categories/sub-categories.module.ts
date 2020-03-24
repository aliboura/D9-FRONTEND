import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubCategoriesComponent} from './sub-categories.component';
import {SubCategoriesListComponent} from './sub-categories-list/sub-categories-list.component';
import {SubCategoriesAddComponent} from './sub-categories-add/sub-categories-add.component';
import {SubCategoriesEditComponent} from './sub-categories-edit/sub-categories-edit.component';
import {SubCategoriesRoutingModule} from "./sub-categories-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../importes/material/material.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [SubCategoriesComponent, SubCategoriesListComponent, SubCategoriesAddComponent, SubCategoriesEditComponent],
    imports: [
        CommonModule,
        SubCategoriesRoutingModule,
        SharedModule,
        MaterialModule,
        TranslateModule
    ]
})
export class SubCategoriesModule {
}
