import {Component, OnInit} from '@angular/core';
import {StatusService} from "../../../../business/services/referencial/status.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {Status} from "../../../../business/models/referencial/status";
import {TypeInput} from "../../../../shared/enum/type-input.enum";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html'
})
export class StatusEditComponent implements OnInit {

  constructor(public statusService: StatusService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  id: number;
  selected: Observable<Status>;
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
        this.statusService.findById(params.get("id"))
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
      description: new FormControl(),
      styleCSS: new FormControl(),
      motif: new FormControl()
    });
  }

  private loadFormData(status: Status) {
    this.editForm = new FormGroup({
      id: new FormControl(status.id),
      label: new FormControl(
        status.label,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      description: new FormControl(status.description),
      styleCSS: new FormControl(status.styleCSS),
      motif: new FormControl(status.motif)
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
        "Minimum 3 caractère."
      ),
      new ModelGeneric(
        "description",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "styleCSS",
        TypeInput.Input,
        false,
        false,
        false,
        false,
        null,
        ""
      ),
      new ModelGeneric(
        "motif",
        TypeInput.CheckBox,
        false,
        false,
        false,
        false,
        null,
        ""
      )
    ]);
  }

}
