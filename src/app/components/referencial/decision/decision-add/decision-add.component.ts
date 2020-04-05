import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {TypeInput} from "../../../../shared/enum/type-input.enum";

@Component({
  selector: 'app-decision-add',
  templateUrl: './decision-add.component.html'
})
export class DecisionAddComponent implements OnInit {

  constructor(public decisionService: DecisionService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: ModelGeneric<any>[] = [];

  ngOnInit() {
    this.title = "Nouvelle décision";
    this.object = "decisions";
    this.addForm = this.initForm();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      position: new FormControl("1"),
      typeValue: new FormControl(""),
      status: new FormControl(true)
    });
  }

  private loadFormModels(): ModelGeneric<any>[] {
    return [
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
        "position",
        TypeInput.Number,
        false,
        false,
        false,
      ),
      new ModelGeneric(
        "typeValue",
        TypeInput.Number,
        false,
        false,
        false,
      ),
      new ModelGeneric(
        "status",
        TypeInput.CheckBox,
        false,
        false,
        false,
      )
    ];
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
