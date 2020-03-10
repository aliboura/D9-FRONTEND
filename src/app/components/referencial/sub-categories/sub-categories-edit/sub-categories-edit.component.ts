import {Component, OnInit} from '@angular/core';
import {SubCategoriesService} from "../../../../business/services/referencial/sub-categories.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Status} from "../../../../business/models/referencial/status";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {switchMap} from "rxjs/operators";
import {SubCategories} from "../../../../business/models/referencial/sub-categories";

@Component({
  selector: 'app-sub-categories-edit',
  templateUrl: './sub-categories-edit.component.html'
})
export class SubCategoriesEditComponent implements OnInit {

  constructor(public subCategoriesService: SubCategoriesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<SubCategories>;
  editForm: FormGroup;
  fields: ModelGeneric<any>[] = [];
  title: string;
  object: string;

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
      this.fields = this.loadFormModels();
      this.title = "Modifier le status N°: " + this.id;
    });
    this.object = "status";
  }

  public showCreate() {
    this.router.navigate(["referencial/decisions/add"]);
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
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
      position: new FormControl(subCategories.position),
      status: new FormControl(subCategories.status)
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

}
