import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {Categories} from "../../../../business/models/referencial/categories";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {Decision} from "../../../../business/models/referencial/decision";

@Component({
  selector: 'app-sub-categories-add',
  templateUrl: './sub-categories-add.component.html'
})
export class SubCategoriesAddComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private decisionService: DecisionService,
              private formBuilder: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: ModelGeneric<any>[] = [];
  categoriesList: Categories[];
  decisionItems: Decision[];
  filteredOptions: Observable<Categories[]>;
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.title = "Nouvelle sous-catégorie";
    this.object = "sub-categories";
    this.addForm = this.initForm();
    this.decisionService.findAll().subscribe(data => {
      this.decisionItems = data.filter(x => x.position === 1);
    });
    this.categoriesService.findAll().subscribe(data => {
      this.categoriesList = data;
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
      position: new FormControl(""),
      valueType: new FormControl(""),
      decisionsList: new FormControl([], Validators.required),
      status: new FormControl(true),
      blocking: new FormControl(false)
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
        "position",
        TypeInput.Number,
        false,
        false,
        false
      ),
      new ModelGeneric(
        "valueType",
        TypeInput.Number,
        false,
        false,
        false,
      ),
      new ModelGeneric(
        "decisionsList",
        TypeInput.Select,
        true,
        false,
        false,
        true,
        this.decisionItems,
        "Veuillez selectionner au moins une ligne."
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
    ];
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
