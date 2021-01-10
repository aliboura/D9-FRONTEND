import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from "./footer/footer.component";
import {FullLayoutComponent} from "./full-layout/full-layout.component";
import {LeftMenuComponent} from "./left-menu/left-menu.component";
import {TranslateModule} from "@ngx-translate/core";
import {MaterialModule} from "../importes/material/material.module";
import {TemplateRoutingModule} from "./template-routing.module";
import {ClarityModule} from "@clr/angular";
import {CountdownModule} from "ngx-countdown";

@NgModule({
  declarations: [FooterComponent, FullLayoutComponent, LeftMenuComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    TemplateRoutingModule,
    ClarityModule,
    CountdownModule
  ],
  exports: [FooterComponent, FullLayoutComponent, LeftMenuComponent]
})
export class TemplatesModule {
}
