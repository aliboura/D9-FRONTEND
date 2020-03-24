import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {Categories} from "../../../../business/models/referencial/categories";

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html'
})
export class CategoriesAddComponent implements OnInit {

  constructor(public categoriesService: CategoriesService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: ModelGeneric<any>[] = [];
  nextList: Categories[];
  previousList: Categories[];
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.title = "Nouvelle catégorie";
    this.object = "categories";
    this.addForm = this.initForm();
    this.categoriesService.findAll().subscribe(data => {
      this.nextList = data.filter(x => !x.first);
      this.previousList = data.filter(x => !x.last);
      this.fields = this.loadFormModels();
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      position: new FormControl("1"),
      status: new FormControl("y"),
      nextCatId: new FormControl(null),
      previousCatId: new FormControl(null),
      first: new FormControl(),
      last: new FormControl()
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
        TypeInput.Input,
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

  public showCreate() {
    this.addForm = this.initForm();
  }

}
