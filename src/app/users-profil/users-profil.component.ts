import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../business/models/admin/user";
import {UserService} from "../business/services/admin/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";
import * as jwt_decode from "jwt-decode";
import {STATIC_DATA} from "../tools/static-data";

@Component({
  selector: 'app-users-profil',
  templateUrl: './users-profil.component.html'
})
export class UsersProfilComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private cookieService: CookieService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  id: number;
  selected: Observable<User>;
  user: User = new User();


  ngOnInit() {
    if (this.cookieService.check(STATIC_DATA.TOKEN)) {
      const decoded = jwt_decode(this.cookieService.get(STATIC_DATA.TOKEN));
      this.user = new User();
      this.user.matricule = decoded.matricule;
      this.user.fullName = decoded.name;
      this.user.title = decoded.title;
      this.user.email = `${decoded.sub}@DJEZZY.DZ`;
      this.user.phone = decoded.mobile;
      this.user.department = decoded.department;
      this.user.address = decoded.address;
      this.screenSpinnerService.hide(200);
    }
  }

}