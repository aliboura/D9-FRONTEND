import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {WilayaRegion} from "../../../business/models/referencial/wilaya-region";
import {DatePipe} from "@angular/common";
import {ReportService} from "../../../business/services/sites/report.service";
import {JwtTokenService} from "../../../business/services/apps/jwt-token.service";
import {ScreenSpinnerService} from "../../../business/services/apps/screen-spinner.service";
import {ROLES_CODES} from "../../../tools/roles-codes";
import {UserService} from "../../../business/services/admin/user.service";
import {User} from "../../../business/models/admin/user";
import {Status} from "../../../business/models/referencial/status";
import {Reports} from "../../../business/models/sites/reports";
import {saveAs} from "file-saver";

export interface Group {
  id: number;
  label: string;
  field: string;
}

export interface Remarque {
  label: string;
  description: string;
}

@Component({
  selector: 'app-reporting-by-users',
  templateUrl: './reporting-by-users.component.html'
})
export class ReportingByUsersComponent implements OnInit {

  constructor(private datePipe: DatePipe,
              private userService: UserService,
              private reportService: ReportService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  @Input() cityItems: WilayaRegion[];
  @Input() regionId: string;

  statusItems: Remarque[];
  userEngineerItems: User[];
  engineerSite: User;

  status: Status;
  report = new Reports();
  fromDate: Date;
  toDate: Date;
  search: string;
  sort: string;
  sortItems: string[];
  groupeBy: Group;
  groupItems: Group[];
  firstVisit: boolean;
  secondVisit: boolean;

  // @ts-ignore
  @ViewChild('externalPdfViewer') externalPdfViewer;

  ngOnInit() {
    this.report.title = 'Formulaire D9';
    this.report.date = new Date();
    this.report.user = this.jwtTokenService.getFullName();
    this.toDate = new Date();
    this.sort = 'ASC';
    this.groupItems = this.loadGroup();
    this.groupeBy = this.groupItems.filter(x => x.id === 2)[0];
    this.sortItems = ['ASC', 'DESC'];
    this.firstVisit = true;
    this.secondVisit = false;
    this.statusItems = this.loadStatus();
    this.loadUserItems(this.regionId);
  }

  loadUserItems(regionId: string) {
    this.userService.findAll().subscribe(users => {
      this.userEngineerItems = users.filter(x => x.regionId === regionId && this.checkRoles(x, ROLES_CODES.ENGINEER_SITE));
    });
  }

  checkRoles(user: User, role: string): boolean {
    return user.roleSet.filter(x => 'ROLE_' + x.label === role).length > 0;
  }

  exportToPDF() {
    this.screenSpinnerService.show();
    this.report.description = 'Liste : ' + this.status.description + ' - ' + this.engineerSite.lastName + this.engineerSite.firstName;
    if (this.secondVisit) {
      this.report.description += ' - Deuxième Visite';
    } else {
      this.report.description += ' - Première Visite';
    }
    this.report.qrCode = 'Liste des formulaire D9 - ' + this.report.description + '\\n' + this.jwtTokenService.getFullName();
    this.search = this.getQuery();
    this.report.groupBy = this.groupeBy.id;
    const fileTitle = 'Forms-D9' + this.status.description + '.pdf';
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
    this.report.description = 'Liste : ' + this.status.description + ' - ' + this.engineerSite.lastName.toUpperCase() + this.engineerSite.firstName;
    if (this.secondVisit) {
      this.report.description += ' - Deuxième Visite';
    } else {
      this.report.description += ' - Première Visite';
    }
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
    let query = "regionId==" + this.regionId + ';firstVisit==' + this.firstVisit + ';secondVisit==' + this.secondVisit;
    if (this.secondVisit) {
      query = query + ';site.userV2==' + this.engineerSite;
    } else {
      query = query + ';site.userV1==' + this.engineerSite;
    }
    if (this.status) {
      query = query + ';currentSatus.label==' + this.status.label;
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

  private loadStatus(): Remarque[] {
    return [{
      label: 'Conforme',
      description: 'Accepté sans réserves'
    },
      {
        label: 'Accepter avec réserve',
        description: 'Accepté avec réserves'
      },
      {
        label: 'Non Conforme',
        description: 'Rejeté'
      }];
  }

}
