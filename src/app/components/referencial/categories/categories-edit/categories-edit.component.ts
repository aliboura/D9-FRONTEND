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


  ngOnInit() {
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
      this.title = "Modifier la Catégorie N°: " + this.id;
    });
    this.object = "categories";
  }

  public showCreate() {
    this.router.navigate(["referencial/categories/add"]);
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      position: new FormControl(),
      status: new FormControl()
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
      status: new FormControl(category.status)
    });
  }

  private loadFormModels(): ModelGeneric<any>[] {
    return [
      new ModelGeneric(
        "label",
        "Libellé",
        TypeInput.Input,
        "Libellé",
        true,
        false,
        false,
        false,
        null,
        "Minimum 4 caractère."
      ),
      new ModelGeneric(
        "position",
        "Position",
        TypeInput.Number,
        "Position",
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "status",
        "Active",
        TypeInput.Input,
        "Active",
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
