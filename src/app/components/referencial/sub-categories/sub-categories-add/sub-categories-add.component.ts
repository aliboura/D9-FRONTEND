import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {Categories} from "../../../../business/models/referencial/categories";
import {map, startWith} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {DecisionType} from "../../../../business/models/referencial/decision-type";

@Component({
  selector: 'app-sub-categories-add',
  templateUrl: './sub-categories-add.component.html'
})
export class SubCategoriesAddComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private decisionTypeService: DecisionTypeService,
              private formBuilder: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  categoriesList: Categories[];
  familyItems: DecisionType[];
  filteredOptions: Observable<Categories[]>;
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.title = "Nouvelle sous-catégorie";
    this.object = "sub-categories";
    this.addForm = this.initForm();
    this.decisionTypeService.findAll().subscribe(data => {
      this.familyItems = data;
    });
    this.categoriesService.findAll().subscribe(data => {
      this.categoriesList = data.filter(x => x.status);
      this.fields = this.loadFormModels();
    });

    this.filteredOptions = this.addForm.controls.categoriesId.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Categories[] {
    return this.categoriesList.filter(
      option => option.label.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      categoriesId: new FormControl(null, Validators.required),
      valueType: new FormControl(null, Validators.required),
      status: new FormControl(true),
      blocking: new FormControl(false)
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
        "categoriesId",
        TypeInput.Select,
        true,
        false,
        false,
        false,
        this.categoriesList,
        "Veuillez selectionner une catégories."
      ),
      new ModelGeneric(
        "valueType",
        TypeInput.Select,
        false,
        false,
        false,
        false,
        this.familyItems,
        "Veuillez selectionner une famille."
      ),
      new ModelGeneric(
        "blocking",
        TypeInput.CheckBox,
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

  public showCreate() {
    this.addForm = this.initForm();
  }

}
