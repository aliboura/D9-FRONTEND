import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";
import {AppRole} from "../../models/admin/app-role";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<AppRole> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/roles";
  }
}
