import {Component, Inject, OnInit} from '@angular/core';
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {CategoriesLabel} from "../../../../business/models/referencial/categories-label.enum";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";

@Component({
  selector: 'app-audit-site-finish',
  templateUrl: './audit-site-finish.component.html'
})
export class AuditSiteFinishComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auditSiteService: AuditSiteService,
              private statusService: StatusService,
              private decisionService: DecisionService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService,
              private translate: TranslateService,
              @Inject(NOTYF) private notyf: Notyf) {
    this.showSpinner();
  }

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  decisionList: Decision[];
  categoriesEnum = CategoriesLabel;

  ngOnInit() {
    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 2);
    });
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      const idDecision = this.checkDecision(this.auditSite);
      if (!this.auditSite.firstVisit) {
        if (idDecision !== null) {
          this.auditSite.firstDecisionId = idDecision;
          this.auditSite.firstDecisionDate = new Date();
        }
      } else {
        if (idDecision !== null) {
          this.auditSite.secondDecisionId = idDecision;
          this.auditSite.secondDecisionDate = new Date();
        }
      }
      setTimeout(() => {
        this.spinner.hide();
        this.screenSpinnerService.hide();
      }, 200);
    });
  }

  public validateAudit() {
    if (!this.auditSite.firstVisit) {
      this.auditSite.firstVisit = true;
    } else {
      this.auditSite.secondVisit = true;
    }

    this.auditSiteService.updateModel(this.auditSite).subscribe(data => {
      this.auditSite = data;
      this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
      this.router.navigate(["sites-apps/audit"]);
    });
  }

  public cancel() {
    this.router.navigate(["sites-apps/audit"]);
  }

  private checkDecision(auditSite: AuditSite): number {
    if (auditSite.auditSiteLineDtoList.length > 0) {
      const noDecisions = auditSite.auditSiteLineDtoList.filter(x => x.firstDecisionLabel === CategoriesLabel.None);
      if (noDecisions.length > 0) {
        return null;
      } else {
        const conformDecisions = auditSite.auditSiteLineDtoList.filter(x => x.firstDecisionLabel === CategoriesLabel.NoConform);
        if (conformDecisions.length > 0 && conformDecisions.length <= 2) {
          return 6;
        } else if (conformDecisions.length === 0) {
          return 5;
        } else {
          return 7;
        }
      }
    }
    return null;
  }

  private showSpinner() {
    this.screenSpinnerService.show();
    this.spinner.show();
  }

}
