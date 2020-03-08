import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoriesComponent} from './categories.component';
import {CategoriesAddComponent} from './categories-add/categories-add.component';
import {CategoriesListComponent} from './categories-list/categories-list.component';
import {CategoriesEditComponent} from './categories-edit/categories-edit.component';
import {CategoriesRoutingModule} from "./categories-routing.module";


@NgModule({
  declarations: [CategoriesComponent, CategoriesAddComponent, CategoriesListComponent, CategoriesEditComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule {
}
