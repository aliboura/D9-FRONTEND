import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {SiteListComponent} from './site-list/site-list.component';
import {SiteViewComponent} from './site-view/site-view.component';
import {SiteRoutingModule} from "./site-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../importes/material/material.module";
import {PrimengModule} from "../../../importes/primeng/primeng.module";


@NgModule({
  declarations: [SiteComponent, SiteListComponent, SiteViewComponent],
  imports: [
    CommonModule,
    SiteRoutingModule,
    SharedModule,
    MaterialModule,
    PrimengModule
  ]
})
export class SiteModule {
}
