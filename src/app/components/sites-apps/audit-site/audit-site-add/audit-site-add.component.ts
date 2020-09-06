import {Component, Inject, OnInit} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {SiteService} from "../../../../business/services/sites/site.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Site} from "../../../../business/models/sites/site";
import {Observable} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {Categories} from "../../../../business/models/referencial/categories";
import {Status} from "../../../../business/models/referencial/status";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MY_FORMATS} from "../../../../tools/date-format";
import {TypeAuditSiteService} from "../../../../business/services/sites/type-audit-site.service";
import {TypeAuditSite} from "../../../../business/models/sites/type-audit-site";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../../tools/static-data";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-audit-site-add',
  templateUrl: './audit-site-add.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AuditSiteAddComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private siteService: SiteService,
              private categoriesService: CategoriesService,
              private typeAuditSiteService: TypeAuditSiteService,
              private statusService: StatusService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private cookieService: CookieService,
              private screenSpinnerService: ScreenSpinnerService,
              private adapter: DateAdapter<any>,
              private translate: TranslateService,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  auditSite: AuditSite;
  currentCat: Categories;
  currentStatus: Status;
  site: Site;
  private obSite: Observable<Site>;
  codeSite: string;
  typeSite: string;
  typeAuditSiteList: TypeAuditSite[];
  status = StatusEnum;

  ngOnInit() {
    this.adapter.setLocale('fr');
    this.auditSite = new AuditSite();
    this.site = new Site();
    this.auditSite.auditDate = new Date();
    this.obSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.siteService.findById(atob(params.get("id")))
      )
    );
    this.obSite.subscribe(data => {
      this.site = data;
      this.codeSite = this.site.codeSite;
      this.typeSite = this.site.typeSiteId;
      this.auditSite.siteId = this.site.id;
      this.auditSite.siteCode = this.site.codeSite;
      this.auditSite.wilayaId = this.site.wilayaId;
      this.auditSite.regionId = this.site.regionId;
      this.auditSite.userId = this.cookieService.get(STATIC_DATA.USER_NAME);
    });

    this.statusService.getFirst().subscribe(data => {
      this.currentStatus = data;
      this.auditSite.currentSatusId = this.currentStatus.id;
      this.auditSite.currentSatusLabel = this.currentStatus.label;
    });

    this.typeAuditSiteService.findAll().subscribe(data => {
      this.typeAuditSiteList = data.filter(x => x.status);
      if (this.typeAuditSiteList.length === 1) {
        this.auditSite.typeAuditSiteId = this.typeAuditSiteList[0].id;
        this.loadCurrentCat(this.auditSite.typeAuditSiteId);
      }
    });

    this.screenSpinnerService.hide(200);
  }

  private loadCurrentCat(idTypeAudit: number) {
    this.categoriesService.getFirstByType(idTypeAudit).subscribe(data => {
      this.currentCat = data;
      this.auditSite.currentCategoriesId = this.currentCat.id;
    });
  }

  public onChange($event) {
    this.categoriesService.getFirstByType(this.auditSite.typeAuditSiteId).subscribe(data => {
      this.currentCat = data;
      this.auditSite.currentCategoriesId = this.currentCat.id;
    });
  }

  public saveData() {
    if (this.site.powerSupplyConform) {
      this.auditSite.audited = true;
      this.auditSiteService.createModel(this.auditSite).subscribe(
        (data: AuditSite) => {
          this.auditSite = data;
          this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
          this.router.navigate(['steps', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
        }
      );
    } else {
      this.notyf.error("Power Supply 48VDC Site Acceptance Document n'est pas conforme");
    }
  }

  public cancel() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

}
