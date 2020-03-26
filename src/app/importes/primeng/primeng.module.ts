import {NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {FullCalendarModule, InputTextModule} from "primeng";

@NgModule({
  imports: [
    ConfirmDialogModule,
    ToastModule,
    NgSelectModule,
    MessagesModule,
    MessageModule,
    PanelMenuModule,
    TooltipModule,
    FullCalendarModule,
    InputTextModule
  ],
  exports: [
    ConfirmDialogModule,
    ToastModule,
    NgSelectModule,
    MessagesModule,
    MessageModule,
    PanelMenuModule,
    TooltipModule,
    FullCalendarModule,
    InputTextModule
  ]
})
export class PrimengModule {
}
