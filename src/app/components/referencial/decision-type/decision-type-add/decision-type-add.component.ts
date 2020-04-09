import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {Observable, of} from "rxjs";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";

@Component({
  selector: 'app-decision-type-add',
  templateUrl: './decision-type-add.component.html'
})
export class DecisionTypeAddComponent implements OnInit {

  constructor(public decisionTypeService: DecisionTypeService,
              private decisionService: DecisionService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  create: boolean;
  decisionOptions: Decision[];

  ngOnInit() {
    this.create = false;
    this.object = "decisionTypes";
    this.addForm = this.initForm();
    this.decisionService.findAll().subscribe(data => {
      this.decisionOptions = data;
      this.fields = this.loadFormModels();
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      decisionList: new FormControl([], Validators.required)
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
        "decisionList",
        TypeInput.Select,
        true,
        false,
        false,
        true,
        this.decisionOptions,
        "Veuillez selectionner au moins une ligne."
      )
    ]);
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
