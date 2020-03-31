import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Categories} from "../../../../business/models/referencial/categories";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {TypeInput} from "../../../../shared/enum/type-input.enum";

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html'
})
export class CategoriesEditComponent implements OnInit {

  constructor(public categoriesService: CategoriesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<Categories>;
  editForm: FormGroup;
  fields: ModelGeneric<any>[] = [];
  title: string;
  object: string;
  edit: boolean;
  nextList: Categories[];
  previousList: Categories[];


  ngOnInit() {
    this.edit = true;
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.categoriesService.findById(params.get("id"))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
      this.fields = this.loadFormModels();
    });
    this.title = "Modifier la Catégorie N°: " + this.id;
    this.object = "categories";
    this.categoriesService.findAll().subscribe(data => {
      this.nextList = data.filter(x => !x.first);
      this.previousList = data.filter(x => !x.last);
      this.fields = this.loadFormModels();
    });
  }

  public showCreate() {
    this.router.navigate(["referencial/categories/add"]);
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      position: new FormControl(),
      status: new FormControl(),
      nextCatId: new FormControl(null),
      previousCatId: new FormControl(null),
      first: new FormControl(),
      last: new FormControl()
    });
  }

  private loadFormData(category: Categories) {
    this.editForm = new FormGroup({
      id: new FormControl(category.id),
      label: new FormControl(
        category.label,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      position: new FormControl(category.position),
      status: new FormControl(category.status),
      nextCatId: new FormControl(category.nextCatId),
      previousCatId: new FormControl(category.previousCatId),
      first: new FormControl(category.first),
      last: new FormControl(category.last)
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
        "Minimum 4 caractère."
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
      ),
      new ModelGeneric(
        "first",
        TypeInput.CheckBox,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "nextCatId",
        TypeInput.Select,
        false,
        false,
        false,
        false,
        this.nextList,
        "Veuillez selectionner une catégories."
      ),
      new ModelGeneric(
        "last",
        TypeInput.CheckBox,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "previousCatId",
        TypeInput.Select,
        false,
        false,
        false,
        false,
        this.previousList,
        "Veuillez selectionner une catégories."
      )
    ];
  }

}
