import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {SiteType} from "../../models/sites/SiteType";
import {API_URLs} from "../../../tools/api-url";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SiteTypeService extends GenericService<SiteType> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/type_sites";
  }
}
