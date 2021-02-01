import {Component, Inject, OnInit} from '@angular/core';
import {SiteFormsService} from "../../../../business/services/sites/site-forms.service";
import {SiteService} from "../../../../business/services/sites/site.service";
import {SiteForms} from "../../../../business/models/sites/site-forms";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {Site} from "../../../../business/models/sites/site";
import {Observable, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {DomSanitizer} from "@angular/platform-browser";
import {saveAs} from 'file-saver';
import {MatTableDataSource} from "@angular/material/table";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {ConvertService} from "../../../../business/services/admin/convert.service";
import {UtilsService} from "../../../../tools/utils.service";

@Component({
  selector: 'app-site-forms',
  templateUrl: './site-forms.component.html'
})
export class SiteFormsComponent implements OnInit {

  constructor(private sitesFormsService: SiteFormsService,
              private siteService: SiteService,
              private decisionService: DecisionService,
              private convertService: ConvertService,
              private route: ActivatedRoute,
              private router: Router,
              private screenSpinnerService: ScreenSpinnerService,
              private translate: TranslateService,
              private utilsService: UtilsService,
              private sanitizer: DomSanitizer,
              private jwtTokenService: JwtTokenService,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  fileName: string;
  sitesForms: SiteForms = new SiteForms();
  id: string;
  site: Site = new Site();
  private obSite: Observable<Site>;
  decisionList: Decision[];
  siteFormsList: MatTableDataSource<SiteForms>;
  displayedColumns: string[] = ['id', 'fileName', 'decisionLabel', 'fileType', 'action'];
  decision: Decision = new Decision();
  isEngineer: boolean;
  isMySite = false;
  type: string;

  ngOnInit() {
    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 2);
    });
    this.obSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.siteService.findById(atob(params.get("id")))
      )
    );
    this.obSite.subscribe(data => {
      this.site = data;
      this.isMySite = this.utilsService.equalsWithIgnoreCase(this.site.userV1, this.jwtTokenService.getUserName())
        || this.utilsService.equalsWithIgnoreCase(this.site.userV1, this.jwtTokenService.getUserName());
      this.type = this.site.powerSupplyConform ? '2' : '1';
      this.id = this.site.codeSite;
      this.sitesForms.codeSite = this.site.codeSite;
      this.loadAllFiles(this.site.codeSite);
    });
    this.isEngineer = this.jwtTokenService.isSiteEngineer();
  }

  private loadAllFiles(codeSite: string) {
    this.sitesFormsService.findByCodeSite(codeSite).subscribe(data => {
      this.siteFormsList = new MatTableDataSource<SiteForms>(data);
    });
  }

  onSelect(event) {
    if (event) {
      this.sitesForms.decisionId = event.value.id;
      this.sitesForms.decisionLabel = event.value.label;
    }
  }

  onFileChange(event) {
    let file = event.target.files[0];
    this.fileName = file.name;
    this.sitesForms.fileName = file.name;
    this.sitesForms.fileType = file.name.toString().split(".")[1].toLowerCase();
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      this.sitesForms.formsFile = reader.result.toString().split(',')[1];
    };
  }


  public save() {
    if (this.type === '1') {
      if (!this.sitesForms.decisionId) {
        this.notyf.error(this.translate.instant('Veuillez selectionner une remarque.'));
        return;
      }
    } else {
      this.sitesForms.decisionId = null;
      this.sitesForms.decisionLabel = null;
    }

    const newForms = new SiteForms(this.sitesForms.codeSite, this.sitesForms.fileName, this.sitesForms.fileType, this.sitesForms.observation, this.sitesForms.formsFile, this.decision.id, this.decision.label);
    this.sitesFormsService.createForms(newForms)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: SiteForms) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.router.navigate(['.'], {relativeTo: this.route.parent});
        this.screenSpinnerService.hide(200);
      });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  public downloadFile(siteForms: SiteForms) {
    let type = "application/vnd.ms-";
    if (siteForms.fileType === "docx") {
      type = type + "word";
    } else if (siteForms.fileType === "xlsx" || siteForms.fileType === "xls") {
      type = type + "excel";
    } else {
      type = siteForms.fileType;
    }
    const blob = new Blob([this.convertService.base64toBlob(siteForms.formsFile, type)], {type: type});
    const file = new File([blob], siteForms.fileName + '.' + siteForms.fileType, {type: type});
    saveAs(file);
  }


  hidePanel(site: Site): boolean {
    if (this.utilsService.equalsWithIgnoreCase(site.userV1, this.jwtTokenService.getUserName())) {
      return false;
    }
    if (this.utilsService.equalsWithIgnoreCase(site.userV2, this.jwtTokenService.getUserName())) {
      return false;
    }
    return true;
  }

}
