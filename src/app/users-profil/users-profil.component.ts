import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../business/models/admin/user";
import {UserService} from "../business/services/admin/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";
import {STATIC_DATA} from "../tools/static-data";
import {CookieService} from "ngx-cookie";
import {JwtHelperService} from "@auth0/angular-jwt";

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
    if (this.cookieService.hasKey(STATIC_DATA.TOKEN)) {
      console.log('before');
      const jwtHelper = new JwtHelperService();
      const decoded = jwtHelper.decodeToken(this.cookieService.get(STATIC_DATA.TOKEN));
      console.log('after ' + decoded);
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
