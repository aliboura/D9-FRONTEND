import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {map, startWith, switchMap} from "rxjs/operators";
import {SubCategories} from "../../../../business/models/referencial/sub-categories";
import {Categories} from "../../../../business/models/referencial/categories";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {DecisionTypeService} from "../../../../business/services/referencial/decision-type.service";
import {DecisionType} from "../../../../business/models/referencial/decision-type";

@Component({
  selector: 'app-sub-categories-edit',
  templateUrl: './sub-categories-edit.component.html'
})
export class SubCategoriesEditComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private categoriesService: CategoriesService,
              private decisionTypeService: DecisionTypeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<SubCategories>;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  title: string;
  object: string;
  categoriesList: Categories[];
  familyItems: DecisionType[];
  filteredOptions: Observable<Categories[]>;
  edit = true;

  ngOnInit() {
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.subCategoriesService.findById(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
      this.title = "Modifier la sous catégorie N°: " + this.id;
    });

    this.decisionTypeService.findAll().subscribe(data => {
      this.familyItems = data;
    });

    this.categoriesService.findAll().subscribe(data => {
      this.categoriesList = data;
      this.fields = this.loadFormModels();
    });
    this.object = "sub-categories";
    this.filteredOptions = this.editForm.controls.categoriesId.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }


  private _filter(value: string): Categories[] {
    return this.categoriesList.filter(
      option => option.label.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      categoriesId: new FormControl(),
      valueType: new FormControl(),
      status: new FormControl(),
      blocking: new FormControl()
    });
  }

  private loadFormData(subCategories: SubCategories) {
    this.editForm = new FormGroup({
      id: new FormControl(subCategories.id),
      label: new FormControl(
        subCategories.label,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      categoriesId: new FormControl(subCategories.categoriesId, Validators.required),
      valueType: new FormControl(subCategories.valueType, Validators.required),
      status: new FormControl(subCategories.status),
      blocking: new FormControl(subCategories.blocking)
    });
  }

  private loadFormModels(): Observable<ModelGeneric<any>[]> {
    return of([
      new ModelGeneric(
        "label",
        TypeInput.Input,
        true,
        true,
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

}
