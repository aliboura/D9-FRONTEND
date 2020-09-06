import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {WilayaRegion} from "../../../business/models/referencial/wilaya-region";
import {Status} from "../../../business/models/referencial/status";
import {Reports} from "../../../business/models/sites/reports";
import {ReportService} from "../../../business/services/sites/report.service";
import {ScreenSpinnerService} from "../../../business/services/apps/screen-spinner.service";
import {JwtTokenService} from "../../../business/services/apps/jwt-token.service";
import {saveAs} from "file-saver";
import {DatePipe} from "@angular/common";

export interface Group {
  id: number;
  label: string;
  field: string;
}

@Component({
  selector: 'app-reporting-by-status-wilaya',
  templateUrl: './reporting-by-status-wilaya.component.html'
})
export class ReportingByStatusWilayaComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private reportService: ReportService,
    private jwtTokenService: JwtTokenService,
    private screenSpinnerService: ScreenSpinnerService) {
  }

  @Input() statusItems: Status[];
  @Input() cityItems: WilayaRegion[];
  @Input() regionId: string;

  status: Status;
  city: WilayaRegion;
  report = new Reports();
  fromDate: Date;
  toDate: Date;

  search: string;
  sort: string;
  sortItems: string[];
  groupeBy: Group;
  groupItems: Group[];

  // @ts-ignore
  @ViewChild('externalPdfViewer') externalPdfViewer;

  ngOnInit() {
    this.report.title = 'Formulaire D9';
    this.report.date = new Date();
    this.report.user = this.jwtTokenService.getFullName();
    this.toDate = new Date();
    this.sort = 'ASC';
    this.groupItems = this.loadGroup();
    this.groupeBy = this.groupItems.filter(x => x.id === 1)[0];
    this.sortItems = ['ASC', 'DESC'];
  }

  exportToPDF() {
    this.screenSpinnerService.show();
    this.report.description = 'Liste : ' + this.status.description + ' - ' + this.city.label;
    this.report.qrCode = 'Liste des formulaire D9 - ' + this.report.description + '\\n' + this.jwtTokenService.getFullName();
    this.search = this.getQuery();
    this.report.groupBy = this.groupeBy.id;
    const fileTitle = 'Forms-D9' + this.status.description + ' - ' + this.city.label + '.pdf';
    this.reportService.exportToPdf(this.report, this.sort, this.groupeBy.field, this.search).subscribe(x => {
      const blob = new Blob([x, 'application/pdf'], {type: 'application/pdf'});
      const file = new File([blob], fileTitle, {type: 'application/pdf'});
      this.externalPdfViewer.pdfSrc = file;
      this.externalPdfViewer.downloadFileName = fileTitle;
      this.externalPdfViewer.refresh();
      this.screenSpinnerService.hide(200);
    });
  }


  exportToExcel() {
    this.screenSpinnerService.show();
    this.report.description = 'Liste : ' + this.status.description + ' - ' + this.city.label;
    this.report.qrCode = 'Liste des formulaire D9 - ' + this.report.description + '\\n' + this.jwtTokenService.getFullName();
    this.report.groupBy = this.groupeBy.id;
    this.search = this.getQuery();
    this.reportService.exportToExcel(this.report, this.sort, this.groupeBy.field, this.search).subscribe(x => {
      const blob = new Blob([x, 'application/vnd.ms-excel'], {type: 'application/vnd.ms-excel'});
      const file = new File([blob], 'Forms-D9.xls', {type: 'application/vnd.ms-excel'});
      saveAs(file);
      this.screenSpinnerService.hide(200);
    });
  }

  private getQuery(): string {
    let query = "regionId==" + this.regionId;
    if (this.status) {
      query = query + ';currentSatus.id==' + this.status.id;
    }
    if (this.cityItems) {
      query = query + ';wilayaId==' + this.city.id;
    }
    if (this.fromDate) {
      query = query + ';auditDate=ge=' + this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    }
    if (this.fromDate) {
      query = query + ';auditDate=le=' + this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    }
    return query;
  }


  private loadGroup(): Group[] {
    return [{
      id: 1,
      label: 'Status',
      field: 'currentSatus.id'
    },
      {
        id: 2,
        label: 'Wilaya',
        field: 'site.wilaya.id'
      }];
  }

}
