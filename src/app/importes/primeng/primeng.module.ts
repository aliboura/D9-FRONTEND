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

@NgModule({
  imports: [
    ConfirmDialogModule,
    ToastModule,
    AutoCompleteModule,
    DropdownModule,
    NgSelectModule,
    MessagesModule,
    MessageModule,
    PanelMenuModule,
    TooltipModule
  ],
  exports: [
    ConfirmDialogModule,
    ToastModule,
    AutoCompleteModule,
    DropdownModule,
    NgSelectModule,
    MessagesModule,
    MessageModule,
    PanelMenuModule,
    TooltipModule
  ]
})
export class PrimengModule {
}
