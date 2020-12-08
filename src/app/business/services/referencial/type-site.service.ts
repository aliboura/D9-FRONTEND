import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {SiteType} from "../../models/sites/SiteType";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class TypeSiteService extends GenericService<SiteType> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/type_sites";
  }
}
