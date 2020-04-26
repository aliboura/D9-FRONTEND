import {Component, OnInit} from '@angular/core';
import {TypeAuditSiteService} from "../../../../business/services/sites/type-audit-site.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {Categories} from "../../../../business/models/referencial/categories";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeAuditSite} from "../../../../business/models/sites/type-audit-site";
import {switchMap} from "rxjs/operators";
import {TypeInput} from "../../../../shared/enum/type-input.enum";

@Component({
  selector: 'app-type-audit-site-edit',
  templateUrl: './type-audit-site-edit.component.html'
})
export class TypeAuditSiteEditComponent implements OnInit {

  constructor(private typeAuditSiteService: TypeAuditSiteService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<TypeAuditSite>;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  title: string;
  object: string;
  edit: boolean;

  ngOnInit() {
    this.edit = true;
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.typeAuditSiteService.findById(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.loadFormData(data);
      this.fields = this.loadFormModels();
    });
    this.object = "typeAudit";
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      label: new FormControl(),
      description: new FormControl(),
      status: new FormControl()
    });
  }

  private loadFormData(typeAuditSite: TypeAuditSite) {
    this.editForm = new FormGroup({
      id: new FormControl(typeAuditSite.id),
      label: new FormControl(
        typeAuditSite.label,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      description: new FormControl(typeAuditSite.description,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      status: new FormControl(typeAuditSite.status)
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
        "Minimum 4 caractère."
      ),
      new ModelGeneric(
        "description",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        "Minimum 4 caractère."
      ),
      new ModelGeneric(
        "status",
        TypeInput.CheckBox,
        false,
        false
      )
    ]);
  }

}
