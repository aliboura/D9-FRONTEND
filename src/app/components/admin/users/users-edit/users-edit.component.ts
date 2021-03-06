import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../../../business/services/admin/user.service";
import {RoleService} from "../../../../business/services/admin/role.service";
import {RegionService} from "../../../../business/services/referencial/region.service";
import {Observable, throwError} from "rxjs";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {catchError, switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {User} from "../../../../business/models/admin/user";
import {Region} from "../../../../business/models/referencial/region";
import {AppRole} from "../../../../business/models/admin/app-role";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {WilayaRegionService} from "../../../../business/services/referencial/wilaya-region.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";
import {LdapUser} from "../../../../business/models/admin/ldap-user";
import {LdapUserService} from "../../../../business/services/admin/ldap-user.service";

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html'
})
export class UsersEditComponent implements OnInit {

  constructor(private userService: UserService,
              private roleService: RoleService,
              private regionService: RegionService,
              private ldapUserService: LdapUserService,
              private wilayaService: WilayaRegionService,
              private screenSpinnerService: ScreenSpinnerService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  id: number;
  selected: Observable<User>;
  user: User;
  editForm: FormGroup;
  fields: Observable<ModelGeneric<any>[]>;
  edit = true;
  object: string;
  roleItems: Observable<AppRole[]>;
  wilayaItems: Observable<WilayaRegion[]>;
  regionItems: Observable<Region[]>;

  ngOnInit() {
    this.editForm = this.initForm();
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.findByUserName(atob(params.get("id")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.user = data;
      this.loadFormData(this.user);
      if (this.user.regionId) {
        this.loadWilayaItems(this.user.regionId);
      }
    });
    this.object = "users";

    this.regionItems = this.regionService.findAll();

    this.roleItems = this.roleService.findAll();
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl(),
      username: new FormControl(),
      matricule: new FormControl(),
      fullName: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      roleSet: new FormControl(),
      regionId: new FormControl(),
      wilayaSet: new FormControl(),
      enabled: new FormControl()
    });
  }

  private loadWilayaItems(id: string) {
    this.wilayaItems = this.wilayaService.findByRegion(id);
  }

  onSelectChange(event) {
    if (event) {
      this.loadWilayaItems(event.id);
      this.editForm.get('wilayaSet').setValue([]);
    }
  }

  private loadFormData(user: User) {
    this.editForm = new FormGroup({
      id: new FormControl(user.id),
      username: new FormControl(
        user.username,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      matricule: new FormControl(user.matricule, Validators.required),
      fullName: new FormControl(user.fullName, Validators.required),
      email: new FormControl(user.email, Validators.required),
      phone: new FormControl(user.phone, Validators.required),
      roleSet: new FormControl(user.roleSet, Validators.required),
      regionId: new FormControl(user.regionId, Validators.required),
      wilayaSet: new FormControl(user.wilayaSet, Validators.required),
      enabled: new FormControl(user.enabled)
    });
  }

  onClickUpdate() {
    this.screenSpinnerService.show();
    this.ldapUserService.findByLdapUser('username', this.user.username).subscribe(data => {
      if (data.success) {
        this.updateUser(data.body);
      } else {
        this.notyf.error(data.message);
      }
      this.screenSpinnerService.hide(100);
    });
  }

  private updateUser(user: LdapUser) {
    this.editForm.get('matricule').setValue(user.matricule);
    this.editForm.get('username').setValue(user.accountName);
    this.editForm.get('fullName').setValue(user.fullName);
    this.editForm.get('email').setValue(user.mail);
    this.editForm.get('phone').setValue(user.mobile);
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  update(modelForm: NgForm) {
    this.screenSpinnerService.show();
    this.userService
      .update(modelForm)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: User) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.showList();
      });
  }

}
