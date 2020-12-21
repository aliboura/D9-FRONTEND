import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {UserService} from "../../../../business/services/admin/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {AppRole} from "../../../../business/models/admin/app-role";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {Region} from "../../../../business/models/referencial/region";
import {ModelGeneric} from "../../../../shared/model-generic/model-generic";
import {User} from "../../../../business/models/admin/user";
import {RoleService} from "../../../../business/services/admin/role.service";
import {RegionService} from "../../../../business/services/referencial/region.service";
import {WilayaRegionService} from "../../../../business/services/referencial/wilaya-region.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {log} from "util";
import {catchError} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {LdapUserService} from "../../../../business/services/admin/ldap-user.service";
import {LdapUser} from "../../../../business/models/admin/ldap-user";

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html'
})
export class UsersAddComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private regionService: RegionService,
    private wilayaService: WilayaRegionService,
    private userService: UserService,
    private ldapUserService: LdapUserService,
    private screenSpinnerService: ScreenSpinnerService,
    private translate: TranslateService,
    @Inject(NOTYF) private notyf: Notyf) {
  }

  addForm: FormGroup;
  title: string;
  object: string;
  fields: Observable<ModelGeneric<any>[]>;
  roleItems: Observable<AppRole[]>;
  wilayaItems: Observable<WilayaRegion[]>;
  regionItems: Observable<Region[]>;
  exist: boolean;
  showLoading: boolean;
  findBy: string;

  ngOnInit() {
    this.exist = false;
    this.findBy = "matricule";
    this.showLoading = false;
    this.screenSpinnerService.hide(200);
    this.addForm = this.initForm();
    this.object = "users";
    this.regionItems = this.regionService.findAll();
    this.roleItems = this.roleService.findAll();
  }

  initForm() {
    return new FormGroup({
      account: new FormControl(null),
      matricule: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)])),
      fullName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      mobile: new FormControl(null, Validators.required),
      roleSet: new FormControl(null, Validators.required),
      regionId: new FormControl(null, Validators.required),
      wilayaSet: new FormControl(null, Validators.required),
      enabled: new FormControl(true)
    });
  }

  private loadFormData(user: LdapUser) {
    this.addForm = new FormGroup({
      account: new FormControl(null),
      matricule: new FormControl(user.matricule, Validators.required),
      username: new FormControl(user.accountName, Validators.compose([Validators.required, Validators.minLength(4)])),
      fullName: new FormControl(user.fullName, Validators.required),
      email: new FormControl(user.mail, Validators.compose([Validators.required, Validators.email])),
      mobile: new FormControl(user.mobile, Validators.required),
      roleSet: new FormControl(null, Validators.required),
      regionId: new FormControl(null, Validators.required),
      wilayaSet: new FormControl(null, Validators.required),
      enabled: new FormControl(true)
    });
  }

  onSelectChange(event) {
    if (event) {
      this.loadWilayaItems(event.id);
      this.addForm.get('wilayaSet').setValue([]);
    }
  }

  onChangeFind(event) {
    if (event) {
      this.findBy = event.value;
      this.addForm.reset();
    }
  }

  onCheckUser() {
    this.showLoading = true;
    let account = this.addForm.controls['account'].value;
    if (account) {
      this.userService.checkAppUser(this.findBy, account).subscribe(data => {
        if (data) {
          this.showLoading = false;
          this.notyf.error('Cet Utilisateur exist déja.');
        } else {
          this.getUserFromLdap(account);
        }
      });
    }
  }

  private getUserFromLdap(account) {
    this.ldapUserService.findByLdapUser(this.findBy, account).subscribe(data => {
      if (data.success) {
        this.loadFormData(data.body);
      } else {
        this.notyf.error(data.message);
      }
      this.showLoading = false;
    });
  }

  private loadWilayaItems(id: string) {
    this.wilayaItems = this.wilayaService.findByRegion(id);
  }

  save(value: NgForm) {
    this.screenSpinnerService.show();
    this.userService.create(value)
      .pipe(
        catchError(err => {
          this.notyf.error(this.translate.instant("COMMUN.ERROR_MSG"));
          return throwError(err);
        })
      )
      .subscribe((data: User) => {
        this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
        this.showList();
        this.screenSpinnerService.hide(200);
      });
  }

  public showList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

}
