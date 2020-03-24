import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Status} from "../../../../business/models/referencial/status";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {map, startWith, switchMap} from "rxjs/operators";
import {SubCategories} from "../../../../business/models/referencial/sub-categories";
import {Categories} from "../../../../business/models/referencial/categories";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";

@Component({
  selector: 'app-sub-categories-edit',
  templateUrl: './sub-categories-edit.component.html'
})
export class SubCategoriesEditComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private categoriesService: CategoriesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<SubCategories>;
  editForm: FormGroup;
  fields: ModelGeneric<any>[] = [];
  title: string;
  object: string;
  categoriesList: Categories[];
  filteredOptions: Observable<Categories[]>;

  ngOnInit() {
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.subCategoriesService.findById(params.get("id"))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
      this.title = "Modifier la sous catégorie N°: " + this.id;
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

  public showCreate() {
    this.router.navigate(["referencial/decisions/add"]);
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
      position: new FormControl(),
      status: new FormControl()
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
      position: new FormControl(subCategories.position),
      status: new FormControl(subCategories.status)
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
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "status",
        TypeInput.CheckBox,
        false,
        false,
        false,
        false,
        null,
        ""
      )
    ];
  }

}
