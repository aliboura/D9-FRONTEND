import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";

@Component({
  selector: 'app-sub-categories-add',
  templateUrl: './sub-categories-add.component.html'
})
export class SubCategoriesAddComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: ModelGeneric<any>[] = [];

  ngOnInit() {
    this.title = "Nouvelle sous-catégorie";
    this.object = "sub-categories";
    this.addForm = this.initForm();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      position: new FormControl(""),
      status: new FormControl("")
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
        "Minimum 3 caractère."
      ),
      new ModelGeneric(
        "position",
        "Position",
        TypeInput.Input,
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
        TypeInput.CheckBox,
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
