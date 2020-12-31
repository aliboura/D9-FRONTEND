import {Component, Inject, OnInit} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {WilayaRegionService} from "../../../../business/services/referencial/wilaya-region.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {catchError, switchMap} from "rxjs/operators";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from "@angular/material";
import {User} from "../../../../business/models/admin/user";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-wilaya-group-edit',
  templateUrl: './wilaya-group-edit.component.html'
})
export class WilayaGroupEditComponent implements OnInit {

  constructor(public wilayaRegionService: WilayaRegionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private screenSpinnerService: ScreenSpinnerService,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  id: number;
  selected: Observable<WilayaRegion>;
  wilaya: WilayaRegion;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  ngOnInit() {
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.wilayaRegionService.findById(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.wilaya = data;
      this.loadFormData(this.wilaya);
    });
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      regionId: new FormControl(),
      groupSites: new FormControl([]),
      groupOMs: new FormControl([])
    });
  }

  private loadFormData(wilayaRegion: WilayaRegion) {
    this.editForm = new FormGroup({
      id: new FormControl(wilayaRegion.id),
      label: new FormControl(
        wilayaRegion.label,
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      regionId: new FormControl(wilayaRegion.regionId, Validators.required),
      groupSites: new FormControl(wilayaRegion.groupSites),
      groupOMs: new FormControl(wilayaRegion.groupOMs),
    });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }


  removeSite(group: string): void {
    const index = this.wilaya.groupSites.indexOf(group);

    if (index >= 0) {
      this.wilaya.groupSites.splice(index, 1);
      this.editForm.get('groupSites').setValue(this.wilaya.groupSites);
    }
  }

  addSite(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.wilaya.groupSites) {
        this.wilaya.groupSites = [];
      }
      this.wilaya.groupSites.push(value.trim());
      this.editForm.get('groupSites').setValue(this.wilaya.groupSites);
    }

    if (input) {
      input.value = '';
    }
  }

  removeOM(group: string): void {
    const index = this.wilaya.groupOMs.indexOf(group);

    if (index >= 0) {
      this.wilaya.groupOMs.splice(index, 1);
      this.editForm.get('groupOMs').setValue(this.wilaya.groupOMs);
    }
  }

  addOM(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (!this.wilaya.groupOMs) {
      this.wilaya.groupOMs = [];
    }

    if ((value || '').trim()) {
      this.wilaya.groupOMs.push(value.trim());
      this.editForm.get('groupOMs').setValue(this.wilaya.groupOMs);
    }

    if (input) {
      input.value = '';
    }
  }

  update(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.wilayaRegionService
      .update(modelForm)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: WilayaRegion) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.showList();
      });
  }

}
