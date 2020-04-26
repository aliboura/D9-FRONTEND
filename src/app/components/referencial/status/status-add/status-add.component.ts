import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-status-add',
  templateUrl: './status-add.component.html'
})
export class StatusAddComponent implements OnInit {

  constructor(public statusService: StatusService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  edit: boolean;

  ngOnInit() {
    this.edit = false;
    this.title = "Nouveau Status";
    this.object = "status";
    this.addForm = this.initForm();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      description: new FormControl(""),
      styleCSS: new FormControl(""),
      iconCSS: new FormControl(""),
      motif: new FormControl(false)
    });
  }

  private loadFormModels(): Observable<ModelGeneric<any>[]> {
    return of([
      new ModelGeneric(
        "label",
        TypeInput.Input,
        true,
        false,
        false,
        false,
        null,
        "Minimum 3 caractère."
      ),
      new ModelGeneric(
        "description",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "styleCSS",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "iconCSS",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "motif",
        TypeInput.CheckBox,
        false,
        false,
        false,
        false,
        null,
        ""
      )
    ]);
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
