import {ListGenericComponent} from "./list-generic/list-generic.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsGenericComponent} from "./forms-generic/forms-generic.component";
import {PrimengModule} from "../importes/primeng/primeng.module";
import {MaterialModule} from "../importes/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {EmptyMessagesComponent} from './empty-messages/empty-messages.component';

@NgModule({
  declarations: [ListGenericComponent, FormsGenericComponent, EmptyMessagesComponent],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [CommonModule, ListGenericComponent, FormsGenericComponent, EmptyMessagesComponent]
})
export class SharedModule {
}
