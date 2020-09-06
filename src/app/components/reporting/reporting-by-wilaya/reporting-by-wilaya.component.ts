import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ReportService} from "../../../business/services/sites/report.service";
import {JwtTokenService} from "../../../business/services/apps/jwt-token.service";
import {ScreenSpinnerService} from "../../../business/services/apps/screen-spinner.service";
import {Reports} from "../../../business/models/sites/reports";
import {WilayaRegion} from "../../../business/models/referencial/wilaya-region";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-reporting-by-wilaya',
  templateUrl: './reporting-by-wilaya.component.html'
})
export class ReportingByWilayaComponent implements OnInit {

  constructor(private datePipe: DatePipe,
              private reportService: ReportService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  report = new Reports();
  fromDate: Date;
  toDate: Date;

  selectedCityItems: WilayaRegion[];
  @Input() cityItems: WilayaRegion[];
  @Input() regionId: string;

  search: string;
  sort: string;

  // @ts-ignore
  @ViewChild('externalPdfViewer') externalPdfViewer;

  ngOnInit() {
    this.report = new Reports();
    this.report.title = 'Formulaire D9';
    this.report.date = new Date();
    this.report.user = this.jwtTokenService.getFullName();
    this.toDate = new Date();
    this.sort = 'asc';
  }


  exportToPDF() {
    this.screenSpinnerService.show();
    this.report.description = 'Liste ' + this.getCityLabels(this.selectedCityItems) + this.getDateTitle(this.fromDate, this.toDate);
    this.report.qrCode = 'Liste des formulaire D9 - ' + this.report.description + '\\n' + this.jwtTokenService.getFullName();
    this.search = this.getQuery();
    this.report.groupBy = 2;
    const fileTitle = 'Forms-D9' + this.getCityLabels(this.selectedCityItems) + '.pdf';
    this.reportService.exportToPdf(this.report, this.sort, 'site.wilaya.id', this.search).subscribe(x => {
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
    this.report.description = 'Liste ' + this.getCityLabels(this.selectedCityItems) + this.getDateTitle(this.fromDate, this.toDate);
    this.report.qrCode = 'Liste des formulaires D9 - ' + this.report.description + '\\n' + this.jwtTokenService.getFullName();
    this.report.groupBy = 2;
    this.search = this.getQuery();
    this.reportService.exportToExcel(this.report, this.sort, 'site.wilaya.id', this.search).subscribe(x => {
      const blob = new Blob([x, 'application/vnd.ms-excel'], {type: 'application/vnd.ms-excel'});
      const file = new File([blob], 'Forms-D9.xls', {type: 'application/vnd.ms-excel'});
      saveAs(file);
      this.screenSpinnerService.hide(200);
    });
  }


  private getQuery(): string {
    let query = "regionId==" + this.regionId;
    if (this.cityItems) {
      query = query + ';wilayaId=in=(' + this.cityItems.map(x => x.id).toString() + ')';
    }
    if (this.fromDate) {
      query = query + ';auditDate=ge=' + this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    }
    if (this.fromDate) {
      query = query + ';auditDate=le=' + this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    }
    return query;
  }

  private getCityLabels(cityItems: WilayaRegion[]): string {
    if (cityItems) {
      const cityLabels = cityItems.map(x => x.label).toString();
      return ' - ' + cityLabels.split(',').join(' - ');
    }
    return '';
  }

  private getDateTitle(fromDate: Date, toDate: Date): string {
    if (fromDate && toDate) {
      const statusDescriptions = this.datePipe.transform(fromDate, 'yyyy-MM-dd') + ' - ' + this.datePipe.transform(toDate, 'yyyy-MM-dd');
      return ' - ' + statusDescriptions;
    }
    return '';
  }

}
