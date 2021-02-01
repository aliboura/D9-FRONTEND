import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {NOTYF} from "../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {CookieService} from "ngx-cookie";
import {appCookies} from "../../tools/cookies-options";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService,
              private router: Router,
              private formBuilder: FormBuilder,
              private cookieService: CookieService,
              private screenSpinnerService: ScreenSpinnerService,
              @Inject(NOTYF) private notyf: Notyf) {
    this.showSpinner();
  }

  loginForm: FormGroup;
  hide = true;
  startLogin: boolean;

  ngOnInit() {
    this.startLogin = false;
    this.loginForm = this.initForm();
    // @ts-ignore
    this.cookieService.removeAll(appCookies.Options);
    this.screenSpinnerService.hide(300);
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      username: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(4)])
      )
    });
  }

  public onLogin(user: NgForm) {
    this.startLogin = true;
    this.screenSpinnerService.show();
    return this.loginService.postLogin(user)
      .subscribe(
        data => {
          if (data.success) {
            this.loginService.saveToken(data);
            this.screenSpinnerService.hide(200);
          } else {
            this.notyf.error(data.message);
            this.screenSpinnerService.hide(200);
          }
        }
      );
  }

  // public onChangePassword() {
  //   if (this.loginForm.get('password') && this.loginForm.get('password').value) {
  //     this.loginForm.get('password').setValue(btoa(this.loginForm.get('password').value));
  //   }
  // }

  private showSpinner() {
    this.screenSpinnerService.show();
  }
}
