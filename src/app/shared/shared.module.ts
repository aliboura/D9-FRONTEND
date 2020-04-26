import {ListGenericComponent} from "./list-generic/list-generic.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsGenericComponent} from "./forms-generic/forms-generic.component";
import {MaterialModule} from "../importes/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {EmptyMessagesComponent} from './empty-messages/empty-messages.component';
import {NgxCoolDialogsModule} from "ngx-cool-dialogs";
import { AfterSaveComponent } from './after-save/after-save.component';
import {ClrIconModule} from "@clr/angular";

@NgModule({
  declarations: [ListGenericComponent, FormsGenericComponent, EmptyMessagesComponent, AfterSaveComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgxCoolDialogsModule,
        ClrIconModule
    ],
  exports: [CommonModule, ListGenericComponent, FormsGenericComponent, EmptyMessagesComponent, AfterSaveComponent]
})
export class SharedModule {
}
