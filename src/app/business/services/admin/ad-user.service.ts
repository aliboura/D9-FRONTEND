import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {AdUser} from "../../models/admin/ad-user";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class AdUserService extends GenericService<AdUser> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.AUTH_URL + "/users";
  }
}
