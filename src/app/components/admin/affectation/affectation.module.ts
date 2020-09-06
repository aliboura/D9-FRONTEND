import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AffectationRoutingModule} from './affectation-routing.module';
import {AffectationComponent} from './affectation.component';
import {TemplatesModule} from "../../../templates/templates.module";
import {AffectationSiteComponent} from './affectation-site/affectation-site.component';
import {MaterialModule} from "../../../importes/material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ClarityModule} from "@clr/angular";
import {SharedModule} from "../../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AffectationFirstComponent} from './affectation-first/affectation-first.component';
import {AffectationSecondComponent} from './affectation-second/affectation-second.component';
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import { AffectationEditComponent } from './affectation-edit/affectation-edit.component';


@NgModule({
  declarations: [AffectationComponent, AffectationSiteComponent, AffectationFirstComponent, AffectationSecondComponent, AffectationEditComponent],
  imports: [
    CommonModule,
    AffectationRoutingModule,
    TemplatesModule,
    MaterialModule,
    TranslateModule,
    ClarityModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule
  ]
})
export class AffectationModule {
}
