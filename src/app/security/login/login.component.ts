import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService,
              private router: Router,
              private formBuilder: FormBuilder,
              private screenSpinnerService: ScreenSpinnerService) {
    this.showSpinner();
  }

  loginForm: FormGroup;
  hide = true;

  ngOnInit() {
    this.loginForm = this.initForm();
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
    this.screenSpinnerService.show();
    this.loginService.onLogin(user);
  }

  private showSpinner() {
    this.screenSpinnerService.show();
  }
}
