import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/admin/user";
import {API_URLs} from "../../../tools/api-url";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LdapUser} from "../../models/admin/ldap-user";

@Injectable({
  providedIn: 'root'
})
export class LdapUserService {

  constructor(private http: HttpClient) {
  }

  findByLdapUser(param: string, value: string): Observable<LdapUser> {
    return this.http.get<LdapUser>(API_URLs.AUTH_URL + "/users", {
      params: new HttpParams().set(param, value)
    });
  }
}
