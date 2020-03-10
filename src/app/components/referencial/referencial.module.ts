import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferencialRoutingModule} from "./referencial-routing.module";
import {ReferencialComponent} from './referencial.component';


@NgModule({
  declarations: [ReferencialComponent],
  imports: [
    CommonModule,
    ReferencialRoutingModule
  ]
})
export class ReferencialModule {
}
