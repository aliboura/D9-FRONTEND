import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {StatusService} from "../../../../business/services/referencial/status.service";

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
  fields: ModelGeneric<any>[] = [];

  ngOnInit() {
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
      motif: new FormControl(false)
    });
  }

  private loadFormModels(): ModelGeneric<any>[] {
    return [
      new ModelGeneric(
        "label",
        "Libellé",
        TypeInput.Input,
        "Libellé",
        true,
        false,
        false,
        false,
        null,
        "Minimum 3 caractère."
      ),
      new ModelGeneric(
        "description",
        "Déscription",
        TypeInput.Input,
        "Déscription",
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "styleCSS",
        "Style CSS",
        TypeInput.Input,
        "Style CSS",
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "motif",
        "Motif",
        TypeInput.CheckBox,
        "Motif",
        false,
        false,
        false,
        false,
        null,
        ""
      )
    ];
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
