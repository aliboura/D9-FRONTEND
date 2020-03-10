import {Injectable} from '@angular/core';
import {GenericService} from "../../../shared/service-generic/generic.service";
import {Region} from "../../models/referencial/region";
import {HttpClient} from "@angular/common/http";
import {API_URLs} from "../../../tools/api-url";

@Injectable({
  providedIn: 'root'
})
export class RegionService extends GenericService<Region> {

  constructor(http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return API_URLs.APPS_URL + "/regions";
  }
}
