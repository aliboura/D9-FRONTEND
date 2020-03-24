import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {Categories} from "../../../../business/models/referencial/categories";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-sub-categories-add',
  templateUrl: './sub-categories-add.component.html'
})
export class SubCategoriesAddComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private formBuilder: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: ModelGeneric<any>[] = [];
  categoriesList: Categories[];
  filteredOptions: Observable<Categories[]>;

  ngOnInit() {
    this.title = "Nouvelle sous-catégorie";
    this.object = "sub-categories";
    this.addForm = this.initForm();
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

  public showCreate() {
    this.addForm = this.initForm();
  }

}
