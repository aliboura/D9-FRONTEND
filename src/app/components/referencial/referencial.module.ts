import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoriesModule} from "./categories/categories.module";
import {ReferencialRoutingModule} from "./referencial-routing.module";
import { ReferencialComponent } from './referencial.component';


@NgModule({
  declarations: [ReferencialComponent],
  imports: [
    CommonModule,
    ReferencialRoutingModule
  ]
})
export class ReferencialModule {
}