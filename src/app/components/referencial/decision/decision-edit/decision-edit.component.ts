import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {Decision} from "../../../../business/models/referencial/decision";
import {switchMap} from "rxjs/operators";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {DecisionType} from "../../../../business/models/referencial/decision-type";

@Component({
  selector: 'app-decision-edit',
  templateUrl: './decision-edit.component.html'
})
export class DecisionEditComponent implements OnInit {

  constructor(public decisionService: DecisionService,
              private decisionTypeService: DecisionTypeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<Decision>;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  familyItems: DecisionType[];
  title: string;
  object: string;
  edit: boolean;

  ngOnInit() {
    this.edit = true;
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.decisionService.findById(params.get("id"))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
    });
    this.decisionTypeService.findAll().subscribe(data => {
      this.familyItems = data;
      this.fields = this.loadFormModels();
    });
    this.object = "decisions";
  }

  public showCreate() {
    this.router.navigate(["referencial/decisions/add"]);
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      decisionTypeId: new FormControl(),
      position: new FormControl(),
      status: new FormControl()
    });
  }

  private loadFormData(decision: Decision) {
    this.editForm = new FormGroup({
      id: new FormControl(decision.id),
      label: new FormControl(
        decision.label,
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      decisionTypeId: new FormControl(decision.decisionTypeId, Validators.required),
      position: new FormControl(decision.position),
      status: new FormControl(decision.status)
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
        false
      ),
      new ModelGeneric(
        "status",
        TypeInput.CheckBox,
        false,
        false,
        false
      )
    ]);
  }

}
