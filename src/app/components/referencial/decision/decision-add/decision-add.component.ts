import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {Observable, of} from "rxjs";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {DecisionType} from "../../../../business/models/referencial/decision-type";

@Component({
  selector: 'app-decision-add',
  templateUrl: './decision-add.component.html'
})
export class DecisionAddComponent implements OnInit {

  constructor(public decisionService: DecisionService,
              private decisionTypeService: DecisionTypeService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  familyItems: DecisionType[];
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.title = "Nouvelle décision";
    this.object = "decisions";
    this.addForm = this.initForm();
    this.decisionTypeService.findAll().subscribe(data => {
      this.familyItems = data;
      this.fields = this.loadFormModels();
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      decisionTypeId: new FormControl(null, Validators.required),
      position: new FormControl("1"),
      status: new FormControl(true)
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
        "decisionTypeId",
        TypeInput.Select,
        false,
        false,
        false,
        false,
        this.familyItems,
        "Veuillez selectionner une famille."
      ),
      new ModelGeneric(
        "position",
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
    ]);
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
