import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../business/services/referencial/categories.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {Categories} from "../../../../business/models/referencial/categories";
import {TypeAuditSite} from "../../../../business/models/sites/type-audit-site";
import {TypeAuditSiteService} from "../../../../business/services/sites/type-audit-site.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html'
})
export class CategoriesAddComponent implements OnInit {

  constructor(public categoriesService: CategoriesService,
              private typeAuditSiteService: TypeAuditSiteService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  typeAuditSiteList: Observable<TypeAuditSite[]>;
  nextList: Observable<Categories[]>;
  previousList: Observable<Categories[]>;
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.title = "Nouvelle catégorie";
    this.object = "categories";
    this.addForm = this.initForm();
    this.nextList = this.categoriesService.findAllOnlyFirst();
    this.previousList = this.categoriesService.findAllOnlyLast();
    this.typeAuditSiteList = this.typeAuditSiteService.findAll();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      typeAuditSiteId: new FormControl([], Validators.required),
      position: new FormControl("1"),
      status: new FormControl(true),
      nextCatId: new FormControl(null),
      previousCatId: new FormControl(null),
      first: new FormControl(),
      last: new FormControl()
    });
  }

  private loadFormModels(): Observable<ModelGeneric<any>[]> {
    return of([
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
        "typeAuditSiteId",
        TypeInput.Observable,
        true,
        false,
        false,
        false,
        null,
        "Veuillez selectionner le type audit.",
        this.typeAuditSiteList
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
        TypeInput.Observable,
        false,
        false,
        false,
        false,
        null,
        "Veuillez selectionner une catégories.",
        this.nextList
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
        TypeInput.Observable,
        false,
        this.addForm.get('first').value,
        false,
        false,
        null,
        "Veuillez selectionner une catégories.",
        this.previousList
      )
    ]);
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
