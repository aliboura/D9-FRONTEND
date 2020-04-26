import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../../../business/models/admin/user";
import {UserService} from "../../../../business/services/admin/user.service";
import {RoleService} from "../../../../business/services/admin/role.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {CookieService} from "ngx-cookie-service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";

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
    this.selected = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.findByUserName(atob(params.get("username")))
      )
    );
    this.selected.subscribe(data => {
      this.id = data.id;
      this.user = data;
      this.screenSpinnerService.hide(200);
    });
  }

}
