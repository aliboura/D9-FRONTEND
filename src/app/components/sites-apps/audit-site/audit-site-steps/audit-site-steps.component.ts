import {Component, OnInit} from '@angular/core';
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {AuditSteps} from "../../../../business/models/sites/audit-steps";
import {Categories} from "../../../../business/models/referencial/categories";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {Observable} from "rxjs";
import {AuditSiteLine} from "../../../../business/models/sites/audit-site-line";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {AuditSiteLineService} from "../../../../business/services/sites/audit-site-line.service";
import {MessageService} from "primeng";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-audit-site-steps',
  templateUrl: './audit-site-steps.component.html'
})
export class AuditSiteStepsComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private auditSiteLineService: AuditSiteLineService,
              private categoriesService: CategoriesService,
              private decisionService: DecisionService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService) {
    this.showSpinner();
  }

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  auditSiteLines: AuditSiteLine[] = [];
  decisionList: Decision[];
  currentCat: Categories = new Categories();
  title: string;
  editCat: boolean;

  ngOnInit() {
    this.editCat = true;
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(params.get("id"))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      this.loadData(this.auditSite, 1);
      setTimeout(() => {
        this.spinner.hide();
        this.screenSpinnerService.hide();
      }, 200);
    });
  }

  private showSpinner() {
    this.screenSpinnerService.show();
    this.spinner.show();
  }


  private loadData(auditSite: AuditSite, type: number) {
    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data;
    });
    switch (type) {
      case 1 : {
        this.currentCat = auditSite.currentCategory;
        this.setCategories(auditSite, this.currentCat);
        break;
      }
      case 2 : {
        this.getCatgeories(this.currentCat.nextCatId).subscribe(cat => {
          this.currentCat = cat;
          this.setCategories(auditSite, this.currentCat);
        });
        break;
      }
      case 3 : {
        this.getCatgeories(this.currentCat.previousCatId).subscribe(cat => {
          this.currentCat = cat;
          this.setCategories(auditSite, this.currentCat);
        });
        break;
      }
      default: {
        this.currentCat = auditSite.currentCategory;
        this.setCategories(auditSite, this.currentCat);
        break;
      }
    }
  }

  private loadLines(auditSite: AuditSite, currentCat: Categories) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.auditSiteLines = [];
    this.currentCat.listSubCategories.forEach(sub => {
      if (sub.status) {
        this.auditSiteLines.push(new AuditSiteLine(auditSite.id, sub.label, sub.id, currentCat.id, ""));
      }
    });
  }

  private getCatgeories(id: number): Observable<Categories> {
    return this.categoriesService.findById("" + id);
  }

  private setCategories(auditSite: AuditSite, categories: Categories) {
    this.title = categories.id + " - " + categories.label;
    if (auditSite.auditSiteLineDtoList.length > 0) {
      const list = auditSite.auditSiteLineDtoList.filter(x => x.categoriesId === categories.id);
      if (list.length > 0) {
        this.auditSiteLines = list;
      } else {
        this.loadLines(auditSite, categories);
      }
    } else {
      this.loadLines(auditSite, categories);
    }
  }

  private saveLines() {
    this.auditSiteLineService.goToNextSteps(new AuditSteps(this.auditSite, this.auditSiteLines, this.editCat))
      .subscribe(ee => {
        this.auditSite = ee;
        this.loadData(this.auditSite, 2);
        this.editCat = true;
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }

  private checkLines(auditSiteLines: AuditSiteLine[]): boolean {
    const list = auditSiteLines.filter(x => x.firstDecisionId !== null);
    return list.length > 0;
  }

  public goToNext() {
    if (this.auditSiteLines.length > 0) {
      this.showSpinner();
      this.saveLines();
      this.messageService.add({
        severity: "info",
        summary: this.auditSite.currentCategory.id + " - " + this.auditSite.currentCategory.label,
      });
    }
  }

  public goToPrevious() {
    this.showSpinner();
    this.loadData(this.auditSite, 3);
    this.editCat = false;
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, 200);
  }


  public cancel() {
    if (this.checkLines(this.auditSiteLines)) {
      this.confirm();
    } else {
      this.router.navigate(["sites-apps/audit"]);
    }
  }

  private confirm() {
    this.confirmationService.confirm({
      message: this.translate.instant("COMMUN.BACK_MSG"),
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.editCat = false;
        this.saveLines();
        this.router.navigate(["sites-apps/audit"]);
        this.messageService.add({
          severity: "success",
          summary: this.translate.instant("COMMUN.SUCCESS_MSG")
        });
      }
    });
  }

}