import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {User} from "../../models/admin/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {Observable} from "rxjs";
import {LdapUser} from "../../models/admin/ldap-user";

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/users";
  }

  findByUserName(username: string): Observable<User> {
    return this.getHttp().get<User>(this.getApi(), {
      params: new HttpParams().set("username", username)
    });
  }

  checkAppUser(param: string, value: string): Observable<LdapUser> {
    return this.getHttp().get<LdapUser>(this.getApi(), {
      params: new HttpParams().set(param, value)
    });
  }

}
