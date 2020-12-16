import {Component, Inject, OnInit} from '@angular/core';
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {CategoriesLabel} from "../../../../business/models/referencial/categories-label.enum";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {DatePipe} from "@angular/common";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {VisitCheck} from "../../../../business/models/referencial/visit-check.enum";
import {AuditSteps} from "../../../../business/models/sites/audit-steps";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../../tools/static-data";
import {UtilsService} from "../../../../tools/utils.service";

@Component({
  selector: 'app-audit-site-finish',
  templateUrl: './audit-site-finish.component.html'
})
export class AuditSiteFinishComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auditSiteService: AuditSiteService,
              private statusService: StatusService,
              private utilsService: UtilsService,
              private decisionService: DecisionService,
              private screenSpinnerService: ScreenSpinnerService,
              private jwtTokenService: JwtTokenService,
              private cookieService: CookieService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  decisionList: Decision[];
  decision: Decision;
  categoriesEnum = CategoriesLabel;
  statusEnum = StatusEnum;
  private token: string;
  isSiteEngineer: boolean;
  isOMEngineer: boolean;
  showSecond: boolean;
  isMySite = false;

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
      this.token = this.cookieService.get(STATIC_DATA.TOKEN);
      this.isSiteEngineer = this.jwtTokenService.isSiteEngineer();
      this.isOMEngineer = this.jwtTokenService.isOMEngineer();
      this.isMySite = this.isUserValidate(data, this.jwtTokenService.getUserName());
      if (!data.firstVisit) {
        this.auditSite = this.checkDecisionV1(data, this.isSiteEngineer, this.isOMEngineer);
      } else {
        this.auditSite = this.checkDecisionV2(data, this.isSiteEngineer, this.isOMEngineer);
      }
      this.showSecond = this.auditSite.firstVisit;
      this.screenSpinnerService.hide(200);
    });
  }

  public validateAudit() {
    if (!this.auditSite.firstVisit) {
      this.auditSite.firstVisit = true;
    } else {
      this.auditSite.secondVisit = true;
    }
    this.auditSiteService.goToFinish(new AuditSteps(this.auditSite, null, null, false))
      .subscribe(data => {
        this.auditSite = data;
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.router.navigate(['.'], {relativeTo: this.route.parent});
      });
  }

  public cancel() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  private setStatusValueV1(decision: Decision, auditSite: AuditSite) {
    auditSite.firstDecisionId = decision.id;
    auditSite.firstDecisionLabel = decision.label;
    auditSite.firstDecisionDate = new Date();
  }

  private setStatusValueV2(decision: Decision, auditSite: AuditSite) {
    auditSite.secondDecisionId = decision.id;
    auditSite.secondDecisionLabel = decision.label;
    auditSite.secondDecisionDate = new Date();
  }

  private checkDecisionV1(auditSite: AuditSite, isSiteEngineer: boolean, isOMEngineer: boolean): AuditSite {
    const noConformRBs = auditSite.auditSiteLineDtoList.filter(x => x.blocking && x.firstDecisionLabel === CategoriesLabel.NoConform);
    if (noConformRBs.length > 0) {
      this.decisionService.findByLabelAndPosition(VisitCheck.NoConform.toString(), 2).subscribe(decision => {
        this.setStatusValueV1(decision, auditSite);
      });
    } else {
      const noConforms = auditSite.auditSiteLineDtoList.filter(x => !x.blocking && x.firstDecisionLabel === CategoriesLabel.NoConform);
      if (noConforms.length > 0) {
        this.decisionService.findByLabelAndPosition(VisitCheck.Accepted.toString(), 2).subscribe(decision => {
          this.setStatusValueV1(decision, auditSite);
        });
      } else {
        this.decisionService.findByLabelAndPosition(VisitCheck.Conform.toString(), 2).subscribe(decision => {
          this.setStatusValueV1(decision, auditSite);
        });
      }
    }
    if (isSiteEngineer
      && this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV1, this.jwtTokenService.getUserName())
      && auditSite.firstDecisionEngineerSite === undefined) {
      auditSite.firstDecisionEngineerSite = this.jwtTokenService.getFullName();
    }
    if (isOMEngineer
      && this.utilsService.equalsWithIgnoreCase(auditSite.siteUserOMV1, this.jwtTokenService.getUserName())
      && auditSite.firstDecisionEngineerOM === undefined) {
      auditSite.firstDecisionEngineerOM = this.jwtTokenService.getFullName();
    }
    return auditSite;
  }

  private checkDecisionV2(auditSite: AuditSite, isSiteEngineer: boolean, isOMEngineer: boolean): AuditSite {
    const noConformRBs = auditSite.auditSiteLineDtoList.filter(x => x.blocking && x.secondDecisionLabel === CategoriesLabel.NoConform);
    if (noConformRBs.length > 0) {
      this.decisionService.findByLabelAndPosition(VisitCheck.NoConform.toString(), 2).subscribe(decision => {
        this.setStatusValueV2(decision, auditSite);
      });
    } else {
      const noConforms = auditSite.auditSiteLineDtoList.filter(x => !x.blocking && x.secondDecisionLabel === CategoriesLabel.NoConform);
      if (noConforms.length > 0) {
        this.decisionService.findByLabelAndPosition(VisitCheck.Accepted.toString(), 2).subscribe(decision => {
          this.setStatusValueV2(decision, auditSite);
        });
      } else {
        this.decisionService.findByLabelAndPosition(VisitCheck.Conform.toString(), 2).subscribe(decision => {
          this.setStatusValueV2(decision, auditSite);
        });
      }
    }

    if (isSiteEngineer
      && this.utilsService.equalsWithIgnoreCase(auditSite.siteUserV2, this.jwtTokenService.getUserName())
      && auditSite.secondDecisionEngineerSite === undefined) {
      auditSite.secondDecisionEngineerSite = this.jwtTokenService.getFullName();
    }
    if (isOMEngineer
      && this.utilsService.equalsWithIgnoreCase(auditSite.siteUserOMV2, this.jwtTokenService.getUserName())
      && auditSite.secondDecisionEngineerOM === undefined) {
      auditSite.secondDecisionEngineerOM = this.jwtTokenService.getFullName();
    }
    return auditSite;
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy');
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

}
