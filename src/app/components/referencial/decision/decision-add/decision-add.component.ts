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
      status: new FormControl(true)
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
        "position",
        "Position",
        TypeInput.Number,
        "Position",
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "status",
        "Active",
        TypeInput.CheckBox,
        "Active",
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
