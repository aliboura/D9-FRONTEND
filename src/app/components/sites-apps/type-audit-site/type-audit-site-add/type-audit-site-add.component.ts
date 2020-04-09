import {Component, OnInit} from '@angular/core';
import {TypeAuditSiteService} from "../../../../business/services/sites/type-audit-site.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-type-audit-site-add',
  templateUrl: './type-audit-site-add.component.html'
})
export class TypeAuditSiteAddComponent implements OnInit {

  constructor(private typeAuditSiteService: TypeAuditSiteService,
              private formBuilder: FormBuilder) {
  }

  addForm: FormGroup;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  create: boolean;

  ngOnInit() {
    this.create = false;
    this.object = "typeAudit";
    this.addForm = this.initForm();
    this.fields = this.loadFormModels();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      description: new FormControl("",
        Validators.compose([Validators.required, Validators.minLength(4)])),
      status: new FormControl(true),
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
        false,
        false
      )
    ]);
  }

  public showCreate() {
    this.addForm = this.initForm();
  }

}
