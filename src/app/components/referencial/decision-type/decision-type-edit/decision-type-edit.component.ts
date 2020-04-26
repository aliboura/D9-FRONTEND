import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {DecisionType} from "../../../../business/models/referencial/decision-type";
import {switchMap} from "rxjs/operators";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";

@Component({
  selector: 'app-decision-type-edit',
  templateUrl: './decision-type-edit.component.html'
})
export class DecisionTypeEditComponent implements OnInit {

  constructor(public decisionTypeService: DecisionTypeService,
              private decisionService: DecisionService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<DecisionType>;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  object: string;
  edit: boolean;
  decisionOptions: Decision[];

  ngOnInit() {
    this.edit = true;
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.decisionTypeService.findById(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
    });
    this.object = "decisionTypes";
    this.decisionService.findAll().subscribe(data => {
      this.decisionOptions = data;
      this.fields = this.loadFormModels();
    });
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      position: new FormControl(),
      status: new FormControl(),
      decisionList: new FormControl()
    });
  }

  private loadFormData(decisionType: DecisionType) {
    this.editForm = new FormGroup({
      id: new FormControl(decisionType.id),
      label: new FormControl(
        decisionType.label,
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      decisionList: new FormControl(decisionType.decisionList, Validators.required)
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

}
