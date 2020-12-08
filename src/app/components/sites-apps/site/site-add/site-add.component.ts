import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {SiteService} from "../../../../business/services/sites/site.service";
import {Observable, throwError} from "rxjs";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {RegionService} from "../../../../business/services/referencial/region.service";
import {Region} from "../../../../business/models/referencial/region";
import {SiteTypeService} from "../../../../business/services/sites/site-type.service";
import {SiteType} from "../../../../business/models/sites/SiteType";
import {WilayaRegionService} from "../../../../business/services/referencial/wilaya-region.service";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {catchError} from "rxjs/operators";
import {Site} from "../../../../business/models/sites/site";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html'
})
export class SiteAddComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public siteService: SiteService,
    private regionService: RegionService,
    private siteTypeService: SiteTypeService,
    private wilayaService: WilayaRegionService,
    private screenSpinnerService: ScreenSpinnerService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    @Inject(NOTYF) private notyf: Notyf) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  create: boolean;
  regionItems: Observable<Region[]>;
  wilayaItems: Observable<WilayaRegion[]>;
  siteTypeItems: Observable<SiteType[]>;

  ngOnInit() {
    this.create = false;
    this.title = "Nouveaux site";
    this.object = "SITE";
    this.addForm = this.initForm();
    this.regionItems = this.regionService.findAll();
    this.siteTypeItems = this.siteTypeService.findAll();
    this.screenSpinnerService.hide(200);
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      codeSite: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      dateD1: new FormControl(null, Validators.required),
      nomSite: new FormControl(null, Validators.required),
      numSite: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      regionId: new FormControl(null, Validators.required),
      wilayaId: new FormControl(null, Validators.required),
      typeSiteId: new FormControl(null, Validators.required)
    });
  }

  onSelectChange(event) {
    if (event) {
      this.wilayaItems = this.wilayaService.findByRegion(event.id);
    }
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

  public save(value: NgForm) {
    this.screenSpinnerService.show();
    this.siteService.create(value)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: Site) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.showList();
        this.screenSpinnerService.hide(200);
      });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

}
