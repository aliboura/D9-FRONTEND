import {NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {FullCalendarModule, InputTextModule} from "primeng";
import {ChartModule} from 'primeng/chart';
import {ProgressBarModule} from 'primeng/progressbar';

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
    InputTextModule,
    ChartModule,
    ProgressBarModule
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
    InputTextModule,
    ChartModule,
    ProgressBarModule
  ]
})
export class PrimengModule {
}
