import {Component, OnInit} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {SiteService} from "../../../../business/services/sites/site.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Site} from "../../../../business/models/sites/site";
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {Categories} from "../../../../business/models/referencial/categories";
import {Status} from "../../../../business/models/referencial/status";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-audit-site-add',
  templateUrl: './audit-site-add.component.html'
})
export class AuditSiteAddComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private siteService: SiteService,
              private categoriesService: CategoriesService,
              private statusService: StatusService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
    this.spinner.show();
  }

  auditSite: AuditSite;
  currentCat: Categories;
  currentStatus: Status;
  site: Site;
  private obSite: Observable<Site>;
  codeSite: string;
  typeSite: string;

  ngOnInit() {
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
      this.auditSite.siteCode = this.site.codeSite;
      this.auditSite.wilayaId = this.site.wilayaId;
      this.auditSite.regionId = this.site.regionId;
    });
    this.categoriesService.getFirst().subscribe(data => {
      this.currentCat = data;
      this.auditSite.currentCategoriesId = this.currentCat.id;
    });
    this.statusService.getFirst().subscribe(data => {
      this.currentStatus = data;
      this.auditSite.currentSatusId = this.currentStatus.id;
      this.auditSite.currentSatusLabel = this.currentStatus.label;
    });
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, 200);
  }

  public saveData() {
    this.auditSiteService.createModel(this.auditSite).subscribe(
      (data: AuditSite) => {
        this.auditSite = data;
        this.router.navigate(["sites-apps/audit/steps", btoa("" + this.auditSite.id)]);
      }
    );
  }

  public cancel() {
    this.router.navigate(["sites-apps/audit"]);
  }

}
