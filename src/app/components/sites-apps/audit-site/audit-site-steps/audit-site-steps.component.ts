import {Component, Inject, OnInit} from '@angular/core';
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
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {CategoriesLabel} from "../../../../business/models/referencial/categories-label.enum";
import {NgxCoolDialogsService} from "ngx-cool-dialogs";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {saveAs} from "file-saver";
import {ConvertService} from "../../../../business/services/admin/convert.service";

@Component({
  selector: 'app-audit-site-steps',
  templateUrl: './audit-site-steps.component.html'
})
export class AuditSiteStepsComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private auditSiteLineService: AuditSiteLineService,
              private categoriesService: CategoriesService,
              private convertService: ConvertService,
              private decisionService: DecisionService,
              private coolDialogs: NgxCoolDialogsService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService,
              private translate: TranslateService,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  auditSiteLines: AuditSiteLine[] = [];
  decisionList: Decision[];
  decisionId: number;
  currentCat: Categories = new Categories();
  selectedCategory: Categories;
  categiryItems: Categories[];
  title: string;
  editCat: boolean;
  categoriesEnum = CategoriesLabel;
  opened = false;
  fileName: string;

  success = false;

  ngOnInit() {
    this.editCat = true;
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      this.success = this.auditSite.lastStep;
      this.auditSite.firstCheckDate = new Date();
      this.loadData(this.auditSite, 1);
      this.screenSpinnerService.hide(200);
    });

    this.categoriesService.findAllSorted('asc', 'orderNum').subscribe(cat => {
      this.categiryItems = cat.filter(x => x.status);
    });
  }

  private showSpinner() {
    this.screenSpinnerService.show();
    this.spinner.show();
  }


  private loadData(auditSite: AuditSite, type: number) {
    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 1);
    });
    switch (type) {
      case 1 : {
        this.getCategories(this.auditSite.currentCategoriesId).subscribe(cat => {
          this.currentCat = cat;
          this.setCategories(auditSite, this.currentCat);
        });
        this.setCategories(auditSite, this.currentCat);
        break;
      }
      case 2 : {
        this.getCategories(this.currentCat.nextCatId).subscribe(cat => {
          this.currentCat = cat;
          this.setCategories(auditSite, this.currentCat);
        });
        break;
      }
      case 3 : {
        this.getCategories(this.currentCat.previousCatId).subscribe(cat => {
          this.currentCat = cat;
          this.setCategories(auditSite, this.currentCat);
        });
        break;
      }
    }
  }

  private loadLines(auditSite: AuditSite, currentCat: Categories) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.currentCat.listSubCategories.forEach(sub => {
      if (sub.status) {
        this.auditSiteLines.push(new AuditSiteLine(auditSite.id, sub.label, sub.id, sub.blocking, sub.valueType, currentCat.id, ""));
        this.screenSpinnerService.hide(200);
      }
    });
  }

  private getCategories(id: number): Observable<Categories> {
    return this.categoriesService.findById("" + id);
  }

  private setCategories(auditSite: AuditSite, categories: Categories) {
    this.title = categories.orderNum + " - " + categories.label;
    this.auditSiteLines = [];
    if (auditSite.auditSiteLineDtoList.length > 0) {
      const list = auditSite.auditSiteLineDtoList.filter(x => x.categoriesId === categories.id);
      if (list.length > 0) {
        this.auditSiteLines = list;
        this.screenSpinnerService.hide(200);
      } else {
        this.loadLines(auditSite, categories);
      }
    } else {
      this.loadLines(auditSite, categories);
    }
  }

  private saveLines() {
    this.auditSiteLineService.goToNextSteps(new AuditSteps(this.auditSite, this.currentCat, this.auditSiteLines, this.currentCat.last ? false : this.editCat))
      .subscribe(ee => {
        this.auditSite = ee;
        this.loadData(this.auditSite, 2);
        this.editCat = true;
        this.screenSpinnerService.hide(200);
      });
  }

  private saveLastLines() {
    this.auditSiteLineService.createAll(this.auditSiteLines)
      .subscribe(ee => {
        this.success = true;
        this.auditSiteLines = ee;
        this.screenSpinnerService.hide(200);
      });
  }

  private checkLines(auditSiteLines: AuditSiteLine[]): boolean {
    const list = auditSiteLines.filter(x => x.firstDecisionId !== null);
    return list.length > 0;
  }

  public goToNext() {
    if (this.auditSiteLines.length > 0) {
      this.showSpinner();
      this.decisionId = null;
      if (this.currentCat.last) {
        this.saveLastLines();
        this.notyf.success('Audit N°: ' + this.auditSite.id + ' Enregistré.');
      } else {
        this.saveLines();
        this.notyf.success(this.translate.instant("COMMUN.LOAD_STEP_MSG"));
      }
    }
  }

  public goToPrevious() {
    this.showSpinner();
    this.editCat = false;
    this.decisionId = null;
    if (this.success) {
      this.success = false;
      this.loadData(this.auditSite, 1);
    } else {
      this.loadData(this.auditSite, 3);
    }
    this.screenSpinnerService.hide(200);
  }

  public onSelectCategoryStep(event) {
    this.selectedCategory = event;
    this.auditSite.currentCategoriesId = this.selectedCategory.id;
    this.decisionId = null;
    this.loadData(this.auditSite, 1);
    if (this.success) {
      this.success = false;
    }
  }

  public goToFinish() {
    this.auditSite.lastStep = true;
    this.auditSiteService.goToFinish(new AuditSteps(this.auditSite, this.currentCat, this.auditSiteLines, false))
      .subscribe(data => {
        this.auditSite = data;
        this.notyf.success('Audit N°: ' + this.auditSite.id + ' Enregistré.');
        this.success = true;
        this.backToList();
      });
  }

  confirm() {
    this.coolDialogs.confirm(this.translate.instant("COMMUN.BACK_MSG"))
      .subscribe(res => {
        if (res) {
          this.saveAndCancel();
        } else {
          this.backToList();
        }
      });
  }


  public saveAndCancel() {
    if (this.checkLines(this.auditSiteLines)) {
      this.editCat = false;
      this.saveLastLines();
      this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
      this.backToList();
    } else {
      this.backToList();
    }
  }

  public backToList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  public onAllSelectDecision() {
    this.auditSiteLines.forEach(x => x.firstDecisionId = this.decisionId);
  }

  onFileChange(event) {
    const file = event.target.files[0];
    this.fileName = file.name;
    this.auditSiteLineService.uploadFile(file).subscribe(data => {
      this.notyf.success(data.message);
    });
  }

  onSaveFile() {
    this.screenSpinnerService.show();
    this.auditSiteLineService.saveFiles(this.auditSite).subscribe(data => {
      this.auditSite = data;
      this.loadData(this.auditSite, 1);
      this.opened = false;
      this.screenSpinnerService.hide(200);
    });
  }


}
