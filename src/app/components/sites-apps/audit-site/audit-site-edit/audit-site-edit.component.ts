import {Component, OnInit, ViewChild} from '@angular/core';
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {DatePipe} from "@angular/common";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {saveAs} from "file-saver";
import {ReportService} from "../../../../business/services/sites/report.service";
import {UtilsService} from "../../../../tools/utils.service";

@Component({
  selector: 'app-audit-site-edit',
  templateUrl: './audit-site-edit.component.html'
})
export class AuditSiteEditComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private decisionService: DecisionService,
              private reportService: ReportService,
              private utilsService: UtilsService,
              public jwtTokenService: JwtTokenService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  showNextVisitBtn = true;

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  decisionList: Decision[];
  statusEnum = StatusEnum;
  isEngineer = true;
  isCreator = true;
  tabIndex = 0;

  // @ts-ignore
  @ViewChild('externalPdfViewer') externalPdfViewer;


  ngOnInit() {
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      this.showNextVisitBtn = this.getShowSecondVisit();
      this.isEngineer = this.isUserValidate(this.auditSite, this.jwtTokenService.getUserName());
      this.isCreator = this.isUserCreate(this.auditSite, this.jwtTokenService.getUserName());
      this.screenSpinnerService.hide(200);
    }, (err: any) => console.log(err));

    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 1);
    });
  }

  public proceed() {
    this.router.navigate(['steps', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  public backToList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  public secondVisit() {
    this.router.navigate(['second', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  public goToValidate() {
    this.router.navigate(['finish', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  showAdd() {
    this.router.navigate(['search'], {relativeTo: this.route.parent});
  }

  getShowSecondVisit(): boolean {
    return (this.auditSite.currentSatusLabel === StatusEnum.Accepted
      || this.auditSite.currentSatusLabel === StatusEnum.NoConform
      || this.auditSite.currentSatusLabel === StatusEnum.InProgressValidateV2)
      && this.auditSite.firstVisit && !this.auditSite.secondVisit;
  }

  disabledUpdateBtn(): boolean {
    if (this.auditSite.firstVisit) {
      return false;
    }
    return this.auditSite.lastStep &&
      (this.auditSite.currentSatusLabel === StatusEnum.InProgressValidate
        || this.auditSite.currentSatusLabel === StatusEnum.InProgressValidateV2
        || this.auditSite.currentSatusLabel === StatusEnum.ValidateBySiteEngineer);
  }

  disabledValidateBtn(): boolean {
    return this.auditSite.lastStep &&
      (this.auditSite.currentSatusLabel === StatusEnum.InProgressValidate
        || this.auditSite.currentSatusLabel === StatusEnum.InProgressValidateV2
        || this.auditSite.currentSatusLabel === StatusEnum.ValidateBySiteEngineer);
  }

  disabledSecondVisitBtn(): boolean {
    return this.auditSite.firstVisit
      && !this.auditSite.secondVisit
      && this.utilsService.equalsWithIgnoreCase(this.auditSite.siteUserV2, this.jwtTokenService.getUserName());
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy h:mm a');
  }

  get dateAudit(): string {
    if (this.auditSite.auditDate) {
      return this.datePipe.transform(this.auditSite.auditDate, 'dd-MM-yyyy');
    } else {
      return "";
    }
  }

  exportToPdf() {
    this.screenSpinnerService.show();
    this.auditSiteService.exportToPdf(this.auditSite.id).subscribe(x => {
      const blob = new Blob([x, 'application/pdf'], {type: 'application/pdf'});
      const file = new File([blob], "Forms-D9-" + this.auditSite.siteCode + ".pdf", {type: 'application/pdf'});
      //saveAs(file);
      this.externalPdfViewer.pdfSrc = file; // pdfSrc can be Blob or Uint8Array
      this.externalPdfViewer.downloadFileName = "Forms-D9-" + this.auditSite.siteCode + ".pdf";
      this.externalPdfViewer.refresh();
      this.screenSpinnerService.hide(100);
    });
  }

  exportToExcel() {
    this.screenSpinnerService.show();
    this.auditSiteService.exportToExcel(this.auditSite.id).subscribe(x => {
      const blob = new Blob([x, 'application/vnd.ms-excel'], {type: 'application/vnd.ms-excel'});
      const file = new File([blob], "Forms-D9-" + this.auditSite.siteCode + ".xls", {type: 'application/vnd.ms-excel'});
      saveAs(file);
      this.screenSpinnerService.hide(100);
    });
  }

  tabChange(event) {
    this.tabIndex = event.index;
  }

  isUserValidate(auditSite: AuditSite, username: string) {
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV1, username)) {
      return true;
    }
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserOMV1, username)) {
      return true;
    }
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV2, username)) {
      return true;
    }
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserOMV2, username)) {
      return true;
    }
    return false;
  }

  isUserCreate(auditSite: AuditSite, username: string) {
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV1, username)) {
      return false;
    }
    if (this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV2, username)) {
      return false;
    }
    return true;
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

}
