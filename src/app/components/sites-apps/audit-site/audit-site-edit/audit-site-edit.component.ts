import {Component, OnInit} from '@angular/core';
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSiteLine} from "../../../../business/models/sites/audit-site-line";
import {Categories} from "../../../../business/models/referencial/categories";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionService} from "../../../../business/services/referencial/decision.service";

@Component({
  selector: 'app-audit-site-edit',
  templateUrl: './audit-site-edit.component.html'
})
export class AuditSiteEditComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private categoriesService: CategoriesService,
              private decisionService: DecisionService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.showSpinner();
  }

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  categoriesList: Categories[] = [];
  decisionList: Decision[];


  ngOnInit() {
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
    });
    this.categoriesService.findSort("asc", "id").subscribe(cat => {
      this.categoriesList = cat.filter(x => x.status);
      setTimeout(() => {
        this.spinner.hide();
        this.screenSpinnerService.hide();
      }, 200);
    });
    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 1);
    });
  }

  public getLines(categoriesId: number): AuditSiteLine[] {
    if (this.auditSite.auditSiteLineDtoList) {
      return this.auditSite.auditSiteLineDtoList.filter(x => x.categoriesId === categoriesId);
    }
    return [];
  }

  private showSpinner() {
    this.screenSpinnerService.show();
    this.spinner.show();
  }


  public proceed() {
    this.router.navigate(["sites-apps/audit/steps", btoa("" + this.auditSite.id)]);
  }

  public backToList() {
    this.router.navigate(["sites-apps/audit"]);
  }

  showAdd() {
    this.router.navigate(["sites-apps/audit/search"]);
  }
}
