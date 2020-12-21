import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../../../business/services/admin/user.service";
import {SiteService} from "../../../../business/services/sites/site.service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {User} from "../../../../business/models/admin/user";
import {ActivatedRoute, Router} from "@angular/router";
import {ROLES_CODES} from "../../../../tools/roles-codes";
import {Site} from "../../../../business/models/sites/site";
import {concat, Observable, of, Subject, throwError} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {VisitPlanningService} from "../../../../business/services/sites/visit-planning.service";
import {TranslateService} from "@ngx-translate/core";
import {VisitPlanning} from "../../../../business/models/sites/visit-planning";
import {ApiResponse} from "../../../../business/models/admin/api-response";

@Component({
  selector: 'app-affectation-first',
  templateUrl: './affectation-first.component.html'
})
export class AffectationFirstComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private siteService: SiteService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private jwtTokenService: JwtTokenService,
    private visitPlanningService: VisitPlanningService,
    private screenSpinnerService: ScreenSpinnerService,
    @Inject(NOTYF) private notyf: Notyf) {
  }

  planningForm: FormGroup;

  site: Site;
  userEngineerItems: User[];
  userOMItems: User[];
  userCities: string;
  userCitiesId: string;
  user: User;
  sysDate: Date;

  siteInput$ = new Subject<string>();
  siteOb: Observable<Site[]>;
  siteLoading = false;


  ngOnInit() {
    this.sysDate = new Date();
    this.planningForm = this.initForm();

    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.loadUserItems(data.regionId);
      this.userCities = data.wilayaSet.map(x => x.label).toString();
      this.userCitiesId = data.wilayaSet.map(x => x.id).toString();
      this.loadSiteItems();
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      siteId: new FormControl(null, Validators.required),
      siteCode: new FormControl(null),
      siteName: new FormControl(null),
      engineerSiteV1: new FormControl(null, Validators.required),
      engineerSiteV1FullName: new FormControl(null),
      engineerSiteV1Mail: new FormControl(null),
      engineerSiteDateV1: new FormControl(new Date(), Validators.required),
      engineerOMV1: new FormControl(null),
      engineerOMV1FullName: new FormControl(null),
      engineerOMV1Mail: new FormControl(null),
      engineerOMDateV1: new FormControl(null)
    });
  }


  trackByFn(item: Site) {
    return item.id;
  }

  private loadSiteItems() {
    this.siteOb = concat(
      of([]),
      this.siteInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.siteLoading = true),
        switchMap(term => this.siteService.findByLikeCodeSite(0, 10, "desc", "id", term, this.userCitiesId).pipe(
          map(x => x.content),
          catchError(() => of([])),
          tap(() => this.siteLoading = false)
        ))
      )
    );
  }

  loadUserItems(regionId: string) {
    this.userService.findAll().subscribe(users => {
      this.userEngineerItems = users.filter(x => x.regionId === regionId && this.checkRoles(x, ROLES_CODES.ENGINEER_SITE));
      this.userOMItems = users.filter(x => x.regionId === regionId && this.checkRoles(x, ROLES_CODES.ENGINEER_OM));
    });
  }

  checkRoles(user: User, role: string): boolean {
    return user.roleSet.filter(x => 'ROLE_' + x.label === role).length > 0;
  }

  onSelectUser(event) {
    if (event) {
      this.user = event;
      this.planningForm.get('engineerSiteV1Mail').setValue(this.user.email);
      this.planningForm.get('engineerSiteV1FullName').setValue(this.user.fullName);
      if (!this.planningForm.get('engineerSiteDateV1').value) {
        this.planningForm.get('engineerSiteDateV1').setValue(new Date());
      }
      this.userCities = this.user.wilayaSet.map(x => x.label).toString();
    }
  }

  onSelectUserOM(event) {
    if (event) {
      this.user = event;
      this.planningForm.get('engineerOMV1Mail').setValue(this.user.email);
      this.planningForm.get('engineerOMV1FullName').setValue(this.user.fullName);
      if (!this.planningForm.get('engineerOMDateV1').value) {
        this.planningForm.get('engineerOMDateV1').setValue(new Date());
      }
      this.userCities = this.user.wilayaSet.map(x => x.label).toString();
    }
  }

  onSelectSite(event) {
    console.log('event.siteName : ' + event.nomSite);
    this.visitPlanningService.existSite(event.id).subscribe(exist => {
      if (exist === true) {
        this.notyf.error("Ce site est déja plannifier");
        this.planningForm.get("siteId").setValue(null);
      } else {
        this.planningForm.get('siteCode').setValue(event.codeSite);
        this.planningForm.get('siteName').setValue(event.nomSite);
      }
    });
  }

  create(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.visitPlanningService.createVisitAndSendMail(modelForm)
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
          this.screenSpinnerService.hide(200);
        } else {
          this.notyf.error(data.message);
        }
      });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  backToList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }


}
