import {ModelGeneric} from "./../model-generic/model-generic";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormGroup, NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {GenericService} from "../service-generic/generic.service";
import {Parents} from "../model-generic/parents";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {Location} from "@angular/common";

@Component({
  selector: "app-forms-generic",
  templateUrl: "./forms-generic.component.html",
  styleUrls: ["./forms-generic.component.css"]
})
export class FormsGenericComponent<T extends Parents> {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private screenSpinnerService: ScreenSpinnerService,
    private messageService: MessageService
  ) {
  }

  @Input() service: GenericService<T>;
  @Input() modelForm: FormGroup;
  @Input() fields: ModelGeneric<any>[];
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
          this.messageService.add({
            severity: "error",
            summary: err.message
          });
          return throwError(err);
        })
      )
      .subscribe((data: T) => {
        this.messageService.add({
          severity: "info",
          summary: "Opération effectué avec succée."
        });
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
          this.messageService.add({
            severity: "error",
            summary: err.message
          });
          return throwError(err);
        })
      )
      .subscribe((data: T) => {
        this.messageService.add({
          severity: "info",
          summary: "Opération effectué avec succée."
        });
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

}
