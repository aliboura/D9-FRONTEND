import {ModelGeneric} from "./../model-generic/model-generic";
import {Component, EventEmitter, Inject, Input, Output} from "@angular/core";
import {FormGroup, NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {GenericService} from "../service-generic/generic.service";
import {Parents} from "../model-generic/parents";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MY_FORMATS} from "../../tools/date-format";
import Notyf from "notyf/notyf";
import {NOTYF} from "../../tools/notyf.token";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-forms-generic",
  templateUrl: "./forms-generic.component.html",
  styleUrls: ["./forms-generic.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FormsGenericComponent<T extends Parents> {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private screenSpinnerService: ScreenSpinnerService,
    private adapter: DateAdapter<any>,
    private translate: TranslateService,
    @Inject(NOTYF) private notyf: Notyf) {
    this.adapter.setLocale('fr');
  }

  @Input() service: GenericService<T>;
  @Input() modelForm: FormGroup;
  @Input() fields: Observable<ModelGeneric<any>[]>;
  @Input() object: string;
  @Input() title: string;
  @Input() routerLink: string;
  @Input() editMode;
  @Input() dataLoading = false;

  @Output() clickShowCreate = new EventEmitter<void>();


  public save(modelForm: NgForm) {
    if (this.editMode) {
      this.update(modelForm);
    } else {
      this.create(modelForm);
    }
  }

  private create(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.service
      .create(modelForm)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: T) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.router.navigate([this.routerLink]);
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }

  private update(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.service
      .update(modelForm)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: T) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.router.navigate([this.routerLink]);
      });
  }

  public showList() {
    this.router.navigate([this.routerLink]);
  }

  public showCreate() {
    this.clickShowCreate.emit();
  }

  filterSelectFn(term: string, item: T) {
    term = term.toLowerCase();
    return (
      item.label.toLowerCase().indexOf(term) > -1 ||
      item.label.toLowerCase() === term
    );
  }


  // this.heroForm.get('album').patchValue(this.albums[0].id);

}
