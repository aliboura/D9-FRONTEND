import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {catchError, switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {VisitPlanning} from "../../../../business/models/sites/visit-planning";
import {VisitPlanningService} from "../../../../business/services/sites/visit-planning.service";
import {DatePipe, registerLocaleData} from "@angular/common";
import {ROLES_CODES} from "../../../../tools/roles-codes";
import {UserService} from "../../../../business/services/admin/user.service";
import {User} from "../../../../business/models/admin/user";
import localeFr from '@angular/common/locales/fr';
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {ApiResponse} from "../../../../business/models/admin/api-response";

@Component({
  selector: 'app-affectation-edit',
  templateUrl: './affectation-edit.component.html'
})
export class AffectationEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private screenSpinnerService: ScreenSpinnerService,
    private visitPlanningService: VisitPlanningService,
    @Inject(NOTYF) private notyf: Notyf) {
    registerLocaleData(localeFr);
  }

  planningForm: FormGroup;
  selected: Observable<VisitPlanning>;
  visit: VisitPlanning;
  userEngineerItems: User[];
  userOMItems: User[];


  ngOnInit() {
    this.planningForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.visitPlanningService.findById(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.visit = data;
      this.loadUserItems(this.visit.regionId);
      this.loadFormsData(this.visit);
    });

  }

  loadUserItems(regionId: string) {
    this.userService.findAll().subscribe(users => {
      this.userEngineerItems = users.filter(x => x.regionId === regionId);
      this.userOMItems = users.filter(x => x.regionId === regionId && this.checkRoles(x, ROLES_CODES.ENGINEER_OM));
    });
  }

  checkRoles(user: User, role: string): boolean {
    return user.roleSet.filter(x => 'ROLE_' + x.label === role).length > 0;
  }

  private loadFormsData(visit: VisitPlanning) {
    this.planningForm = new FormGroup({
      id: new FormControl(visit.id, Validators.required),
      siteId: new FormControl(visit.siteId, Validators.required),
      siteCode: new FormControl(visit.siteCode, Validators.required),
      siteName: new FormControl(visit.siteName, Validators.required),
      audited: new FormControl(visit.audited),
      closed: new FormControl(visit.closed),
      firstVisit: new FormControl(visit.firstVisit),
      secondVisit: new FormControl(visit.secondVisit),
      dateD1: new FormControl(this.getDateFormat(visit.dateD1), Validators.required),
      typeSiteLib: new FormControl(visit.typeSiteId),
      engineerSiteV1: new FormControl(visit.engineerSiteV1, Validators.required),
      engineerSiteDateV1: new FormControl(visit.engineerSiteDateV1 ? new Date(visit.engineerSiteDateV1) : null, Validators.required),
      engineerSiteV1FullName: new FormControl(null),
      engineerSiteV1Mail: new FormControl(null),
      engineerOMV1: new FormControl(visit.engineerOMV1),
      engineerOMDateV1: new FormControl(visit.engineerOMDateV1 ? new Date(visit.engineerOMDateV1) : null),
      engineerOMV1FullName: new FormControl(null),
      engineerOMV1Mail: new FormControl(null),
      engineerSiteV2: new FormControl(visit.engineerSiteV2, visit.firstVisit ? Validators.required : null),
      engineerSiteDateV2: new FormControl(visit.engineerSiteDateV2 ? new Date(visit.engineerSiteDateV2) : null, visit.firstVisit ? Validators.required : null),
      engineerSiteV2FullName: new FormControl(null),
      engineerSiteV2Mail: new FormControl(null),
      engineerOMV2: new FormControl(visit.engineerOMV2),
      engineerOMDateV2: new FormControl(visit.engineerOMDateV2 ? new Date(visit.engineerOMDateV2) : null),
      engineerOMV2FullName: new FormControl(null),
      engineerOMV2Mail: new FormControl(null),
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(),
      siteId: new FormControl(),
      siteCode: new FormControl(),
      siteName: new FormControl(),
      audited: new FormControl(),
      closed: new FormControl(),
      firstVisit: new FormControl(),
      secondVisit: new FormControl(),
      dateD1: new FormControl(),
      typeSiteLib: new FormControl(),
      engineerSiteV1: new FormControl(),
      engineerSiteDateV1: new FormControl(),
      engineerSiteV1FullName: new FormControl(null),
      engineerSiteV1Mail: new FormControl(null),
      engineerOMV1: new FormControl(),
      engineerOMDateV1: new FormControl(),
      engineerOMV1FullName: new FormControl(null),
      engineerOMV1Mail: new FormControl(null),
      engineerSiteV2: new FormControl(),
      engineerSiteDateV2: new FormControl(),
      engineerSiteV2FullName: new FormControl(null),
      engineerSiteV2Mail: new FormControl(null),
      engineerOMV2: new FormControl(),
      engineerOMDateV2: new FormControl(),
      engineerOMV2FullName: new FormControl(null),
      engineerOMV2Mail: new FormControl(null),
    });
  }

  update(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.visitPlanningService
      .updateVisitAndSendMail(modelForm)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: ApiResponse<VisitPlanning>) => {
        if (data.success) {
          this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
          this.showList();
        } else {
          this.notyf.success(data.message);
        }
      });
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy h:mm a');
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  onSelectUserV1(event) {
    if (event) {
      const user = event;
      this.planningForm.get('engineerSiteV1Mail').setValue(user.email);
      this.planningForm.get('engineerSiteV1FullName').setValue(user.fullName);
    }
  }

  onSelectUserOMV1(event) {
    if (event) {
      const user = event;
      this.planningForm.get('engineerOMV1Mail').setValue(user.email);
      this.planningForm.get('engineerOMV1FullName').setValue(user.fullName);
    }
  }

  onSelectUserV2(event) {
    console.log(event);
    if (event) {
      const user = event;
      this.planningForm.get('engineerSiteV2Mail').setValue(user.email);
      this.planningForm.get('engineerSiteV2FullName').setValue(user.fullName);
      if (!this.planningForm.get('engineerSiteDateV2').value) {
        this.planningForm.get('engineerSiteDateV2').setValue(new Date());
      }
    }
  }

  onSelectUserOMV2(event) {
    if (event) {
      const user = event;
      this.planningForm.get('engineerOMV2Mail').setValue(user.email);
      this.planningForm.get('engineerOMV2FullName').setValue(user.fullName);
      if (!this.planningForm.get('engineerOMDateV2').value) {
        this.planningForm.get('engineerOMDateV2').setValue(new Date());
      }
    }
  }

}
