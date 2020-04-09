import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecisionTypeRoutingModule } from './decision-type-routing.module';
import { DecisionTypeComponent } from './decision-type.component';
import { DecisionTypeAddComponent } from './decision-type-add/decision-type-add.component';
import { DecisionTypeListComponent } from './decision-type-list/decision-type-list.component';
import { DecisionTypeEditComponent } from './decision-type-edit/decision-type-edit.component';
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  declarations: [DecisionTypeComponent, DecisionTypeAddComponent, DecisionTypeListComponent, DecisionTypeEditComponent],
  imports: [
    CommonModule,
    DecisionTypeRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class DecisionTypeModule { }
