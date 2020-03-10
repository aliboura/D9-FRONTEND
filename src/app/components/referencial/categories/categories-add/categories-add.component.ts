import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";

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

  ngOnInit() {
    this.title = "Nouvelle catégorie";
    this.object = "categories";
    this.addForm = this.initForm();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      position: new FormControl("1"),
      status: new FormControl("y")
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

  public showCreate() {
    this.addForm = this.initForm();
  }

}
